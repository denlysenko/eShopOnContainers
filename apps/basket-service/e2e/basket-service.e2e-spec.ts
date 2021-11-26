import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { Connection } from 'typeorm';
import { AppModule, exchange } from '../src/app/app.module';
import {
  BasketCheckoutDto,
  BasketItemCreateDto,
  ProductPriceChangedEvent,
} from '../src/app/application';
import { exceptionFactory } from '../src/app/exception.factory';
import {
  EntityNotFoundExceptionFilter,
  MessageProcessor,
} from '../src/app/infrastructure';
import { basketItem } from './fixtures/basket-item';
import { seedBasketItems } from './seeders/seed-basket-items';

const notExistsId = '1dfcae3c-a8c3-4d64-ae5f-06fbb16d86bf';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Basket service', () => {
  let app: NestFastifyApplication;
  let accessToken: string;
  let client: AmqpConnection;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MessageProcessor)
      .useValue({})
      .compile();

    app = moduleRef.createNestApplication(new FastifyAdapter());
    app.useGlobalPipes(new ValidationPipe({ exceptionFactory }));
    app.useGlobalFilters(new EntityNotFoundExceptionFilter());

    client = app.get(AmqpConnection);

    await app.init();
  });

  beforeEach(async () => {
    const connection = app.get(Connection);

    await connection.synchronize(true);
    await seedBasketItems(connection);

    accessToken = jwt.sign({ sub: basketItem.buyerId }, 'qwerty');
  });

  describe('/GET v1/basket', () => {
    it('returns 401 if token not provided', async () => {
      const response = await app.inject({
        method: 'GET',
        path: '/v1/basket',
      });

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('returns empty array if basket not found', async () => {
      const response = await app.inject({
        method: 'GET',
        path: '/v1/basket',
        headers: {
          Authorization: `Bearer ${jwt.sign({ sub: notExistsId }, 'qwerty')}`,
        },
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body).toEqual({ buyerId: notExistsId, basketItems: [] });
    });

    it('returns customer basket', async () => {
      const response = await app.inject({
        method: 'GET',
        path: '/v1/basket',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body).toEqual({
        buyerId: basketItem.buyerId,
        basketItems: [
          {
            id: basketItem.id,
            productId: basketItem.productId,
            productName: basketItem.productName,
            unitPrice: basketItem.unitPrice,
            oldUnitPrice: basketItem.oldUnitPrice,
            quantity: basketItem.quantity,
            pictureUrl: basketItem.pictureUrl,
          },
        ],
      });
    });
  });

  describe('/POST v1/basket', () => {
    let basketItemsDto: BasketItemCreateDto[];

    beforeEach(() => {
      basketItemsDto = [
        {
          productId: 3,
          productName: 'Prism White T-Shirt',
          unitPrice: 12,
          oldUnitPrice: 0,
          pictureUrl: '3.png',
          quantity: 2,
        },
      ];
    });

    it('returns 401 if token not provided', async () => {
      const response = await app.inject({
        method: 'POST',
        path: '/v1/basket',
        payload: basketItemsDto,
      });

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('returns 422 if validation failed', async () => {
      const response = await app.inject({
        method: 'POST',
        path: '/v1/basket',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: [
          {
            ...basketItemsDto[0],
            quantity: 0,
          },
        ],
      });

      expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);

      const body = JSON.parse(response.body);

      expect(body.errors[0].message[0]).toEqual('Invalid number of units');
    });

    it('updates existing basket', async () => {
      const connection = app.get(Connection);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await connection
        .getRepository('basket_items')
        .createQueryBuilder('bi')
        .where('bi.buyerId = :buyerId', { buyerId: basketItem.buyerId })
        .getMany();

      expect(result).toHaveLength(1);
      expect(result[0].productId).toEqual(basketItem.productId);

      const response = await app.inject({
        method: 'POST',
        path: '/v1/basket',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: basketItemsDto,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.basketItems).toHaveLength(1);
      expect(body.basketItems[0].productId).toEqual(
        basketItemsDto[0].productId
      );
    });

    it('creates new basket', async () => {
      const connection = app.get(Connection);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await connection
        .getRepository('basket_items')
        .createQueryBuilder('bi')
        .where('bi.buyerId = :buyerId', { buyerId: notExistsId })
        .getMany();

      expect(result).toHaveLength(0);

      const response = await app.inject({
        method: 'POST',
        path: '/v1/basket',
        headers: {
          Authorization: `Bearer ${jwt.sign({ sub: notExistsId }, 'qwerty')}`,
        },
        payload: basketItemsDto,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.basketItems).toHaveLength(1);
      expect(body.buyerId).toEqual(notExistsId);
      expect(body.basketItems[0].productId).toEqual(
        basketItemsDto[0].productId
      );
    });
  });

  describe('/POST v1/basket/checkout', () => {
    let basketCheckoutDto: BasketCheckoutDto;

    beforeEach(() => {
      basketCheckoutDto = {
        city: 'City',
        street: 'Street',
        state: 'State',
        country: 'Country',
        zipCode: '12345',
        cardNumber: '5398228707871527',
        cardHolderName: 'Test',
        cardExpiration: '2070-01-31T00:00:00.000Z',
        cardSecurityNumber: '123',
        cardTypeId: 1,
        buyer: 'Test',
      };
    });

    it('returns 401 if token not provided', async () => {
      const response = await app.inject({
        method: 'POST',
        path: '/v1/basket/checkout',
        payload: basketCheckoutDto,
      });

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('returns 404 if basket not exists', async () => {
      const response = await app.inject({
        method: 'POST',
        path: '/v1/basket/checkout',
        headers: {
          Authorization: `Bearer ${jwt.sign({ sub: notExistsId }, 'qwerty')}`,
        },
        payload: basketCheckoutDto,
      });

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it('returns 422 if validation failed', async () => {
      const response = await app.inject({
        method: 'POST',
        path: '/v1/basket/checkout',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {
          ...basketCheckoutDto,
          cardNumber: '1234',
        },
      });

      expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);

      const body = JSON.parse(response.body);

      expect(body.errors[0].message[0]).toEqual('cardNumber is invalid');
    });

    it('returns 200 if checkout succeeded', async () => {
      const response = await app.inject({
        method: 'POST',
        path: '/v1/basket/checkout',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: basketCheckoutDto,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);
    });
  });

  describe('/DELETE v1/basket', () => {
    it('returns 401 if token not provided', async () => {
      const response = await app.inject({
        method: 'DELETE',
        path: '/v1/basket',
      });

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('returns 404 if basket not exists', async () => {
      const response = await app.inject({
        method: 'DELETE',
        path: '/v1/basket',
        headers: {
          Authorization: `Bearer ${jwt.sign({ sub: notExistsId }, 'qwerty')}`,
        },
      });

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it('returns 200 if delete succeeded', async () => {
      const response = await app.inject({
        method: 'DELETE',
        path: '/v1/basket',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      expect(response.statusCode).toBe(HttpStatus.OK);
    });
  });

  describe('ProductPriceChangedEvent', () => {
    it('does not process if already has been received', async () => {
      const newPrice = 21.25;
      const event = new ProductPriceChangedEvent(
        basketItem.productId,
        newPrice,
        basketItem.unitPrice
      );

      const connection = app.get(Connection);

      await connection
        .createQueryBuilder()
        .insert()
        .into('inbox')
        .values({ id: event.id })
        .execute();

      client.publish(exchange, event.name, event);

      // wait for async event handler is done
      await sleep(1000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await connection
        .getRepository('basket_items')
        .createQueryBuilder('bi')
        .where('bi.productId = :productId', { productId: basketItem.productId })
        .getMany();

      expect(result[0].unitPrice).toBe(basketItem.unitPrice);
    });

    it('changes unitPrice', async () => {
      const newPrice = 21.25;
      const event = new ProductPriceChangedEvent(
        basketItem.productId,
        newPrice,
        basketItem.unitPrice
      );

      client.publish(exchange, event.name, event);

      // wait for async event handler is done
      await sleep(1000);

      const connection = app.get(Connection);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await connection
        .getRepository('basket_items')
        .createQueryBuilder('bi')
        .where('bi.productId = :productId', { productId: basketItem.productId })
        .getMany();

      expect(result[0].unitPrice).toBe(newPrice);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
