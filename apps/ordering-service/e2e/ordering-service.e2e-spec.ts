import { HttpStatus, ValidationPipe } from '@nestjs/common';
import {
  ClientProxy,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Connection } from 'typeorm';
import { AppModule, eventBusConnection, queue } from '../src/app/app.module';
import {
  ConfirmedOrderStockItem,
  CustomerBasket,
  GracePeriodConfirmedEvent,
  OrderPaymentFailedEvent,
  OrderPaymentSucceededEvent,
  OrderStockConfirmedEvent,
  OrderStockRejectedEvent,
  UserCheckoutAcceptedEvent,
} from '../src/app/application';
import { OrderStatus } from '../src/app/domain';
import { exceptionFactory } from '../src/app/exception.factory';
import {
  EntityNotFoundExceptionFilter,
  MessageProcessor,
  RBMQ_MESSAGE_BUS_CLIENT,
} from '../src/app/infrastructure';
import { buyer } from './fixtures/buyer';
import { cardTypes } from './fixtures/card-types';
import { order } from './fixtures/order';
import { orderItems } from './fixtures/order-items';
import { orderStatuses } from './fixtures/order-statuses';
import { paymentMethod } from './fixtures/payment-method';
import { seedBuyer } from './seeders/seed-buyer';
import { seedCardTypes } from './seeders/seed-card-types';
import { seedOrder } from './seeders/seed-order';
import { seedOrderItems } from './seeders/seed-order-items';
import { seedOrderStatuses } from './seeders/seed-order-statuses';
import { seedPaymentMethods } from './seeders/seed-payment-methods';
import { seedSequences } from './seeders/seed-sequences';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Ordering service', () => {
  let app: NestFastifyApplication;
  let accessToken: string;
  let client: ClientProxy;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MessageProcessor)
      .useValue({})
      .compile();

    app = moduleRef.createNestApplication(new FastifyAdapter());
    app.useGlobalFilters(new EntityNotFoundExceptionFilter());
    app.useGlobalPipes(new ValidationPipe({ exceptionFactory }));
    client = app.get(RBMQ_MESSAGE_BUS_CLIENT);
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [eventBusConnection],
        queue,
        noAck: false,
        queueOptions: {
          durable: false,
        },
      },
    });

    await app.startAllMicroservices();
    await app.init();
  });

  beforeEach(async () => {
    const connection = app.get(Connection);

    await connection.synchronize(true);
    await Promise.all([
      seedBuyer(connection),
      seedCardTypes(connection),
      seedOrderStatuses(connection),
    ]);
    await seedPaymentMethods(connection);
    await seedOrder(connection);
    await seedOrderItems(connection);
    await seedSequences(connection);

    accessToken = jwt.sign({ sub: buyer.identityGuid }, 'qwerty');
  });

  describe('/GET v1/orders', () => {
    it('returns 401 if Authorization token not passed', async () => {
      const response = await app.inject({
        method: 'GET',
        path: '/v1/orders',
      });

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('returns transformed records', async () => {
      const response = await app.inject({
        method: 'GET',
        path: '/v1/orders',
        headers: {
          Authorization: accessToken,
        },
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);
      const status = orderStatuses.find(
        (status) => status.id === order.orderStatusId
      ).name;

      expect(body).toEqual([
        {
          orderNumber: order.id,
          date: order.orderDate,
          status,
          total: orderItems.reduce((acc, item) => {
            acc += item.unitPrice * item.units;

            return acc;
          }, 0),
        },
      ]);
    });
  });

  describe('/GET v1/orders/:id', () => {
    it('returns 401 if Authorization token not passed', async () => {
      const response = await app.inject({
        method: 'GET',
        path: `/v1/orders/${order.id}`,
      });

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('returns 404 if order not exists', async () => {
      const id = 25;

      const response = await app.inject({
        method: 'GET',
        path: `/v1/orders/${id}`,
        headers: {
          Authorization: accessToken,
        },
      });

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);

      const body = JSON.parse(response.body);

      expect(body.message).toEqual(`Order with id ${id} not found`);
    });

    it('returns transformed records', async () => {
      const response = await app.inject({
        method: 'GET',
        path: `/v1/orders/${order.id}`,
        headers: {
          Authorization: accessToken,
        },
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);
      const status = orderStatuses.find(
        (status) => status.id === order.orderStatusId
      ).name;

      expect(body).toEqual({
        orderNumber: 1,
        description: null,
        street: 'Street',
        city: 'City',
        zipCode: '123456',
        country: 'Country',
        date: '2021-10-10T12:40:20.288Z',
        status,
        orderItems: [
          {
            pictureUrl: null,
            productName: 'Product',
            unitPrice: 1.35,
            units: 2,
          },
          {
            pictureUrl: null,
            productName: 'Another Product',
            unitPrice: 3.12,
            units: 1,
          },
          {
            pictureUrl: null,
            productName: 'Yet Another Product',
            unitPrice: 3.24,
            units: 4,
          },
        ],
      });
    });
  });

  describe('/PUT v1/orders/:id/cancel', () => {
    it('returns 401 if Authorization token not passed', async () => {
      const response = await app.inject({
        method: 'PUT',
        path: `/v1/orders/${order.id}/cancel`,
      });

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('returns 404 if order not exists', async () => {
      const id = 25;

      const response = await app.inject({
        method: 'PUT',
        path: `/v1/orders/${id}/cancel`,
        headers: {
          Authorization: accessToken,
        },
      });

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);

      const body = JSON.parse(response.body);

      expect(body.message).toEqual(`Order with id ${id} not found`);
    });

    it('returns 400 if cancelling failed due to PAID status', async () => {
      const response = await app.inject({
        method: 'PUT',
        path: `/v1/orders/${order.id}/cancel`,
        headers: {
          Authorization: accessToken,
        },
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);

      const body = JSON.parse(response.body);

      expect(body.message).toEqual(
        'Is not possible to change the order status from PAID to CANCELLED'
      );
    });

    it('returns 200 if cancelling successful', async () => {
      const connection = app.get(Connection);

      await connection
        .createQueryBuilder()
        .update('orders')
        .set({ orderStatusId: OrderStatus.SUBMITTED })
        .where({ id: order.id })
        .execute();

      const response = await app.inject({
        method: 'PUT',
        path: `/v1/orders/${order.id}/cancel`,
        headers: {
          Authorization: accessToken,
        },
      });

      // wait for async domain event handler is done
      await sleep(1000);

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body).toEqual(true);
    });
  });

  describe('/PUT v1/orders/:id/ship', () => {
    it('returns 401 if Authorization token not passed', async () => {
      const response = await app.inject({
        method: 'PUT',
        path: `/v1/orders/${order.id}/ship`,
      });

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('returns 404 if order not exists', async () => {
      const id = 25;

      const response = await app.inject({
        method: 'PUT',
        path: `/v1/orders/${id}/ship`,
        headers: {
          Authorization: accessToken,
        },
      });

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);

      const body = JSON.parse(response.body);

      expect(body.message).toEqual(`Order with id ${id} not found`);
    });

    it('returns 400 if shipping failed due to UNPAID status', async () => {
      const connection = app.get(Connection);

      await connection
        .createQueryBuilder()
        .update('orders')
        .set({ orderStatusId: OrderStatus.SUBMITTED })
        .where({ id: order.id })
        .execute();

      const response = await app.inject({
        method: 'PUT',
        path: `/v1/orders/${order.id}/ship`,
        headers: {
          Authorization: accessToken,
        },
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);

      const body = JSON.parse(response.body);

      expect(body.message).toEqual(
        'Is not possible to change the order status from SUBMITTED to SHIPPED'
      );
    });

    it('returns 200 if shipping successful', async () => {
      const response = await app.inject({
        method: 'PUT',
        path: `/v1/orders/${order.id}/ship`,
        headers: {
          Authorization: accessToken,
        },
      });

      // wait for async domain event handler is done
      await sleep(1000);

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body).toEqual(true);
    });
  });

  describe('/POST v1/orders/draft', () => {
    it('returns 401 if Authorization token not passed', async () => {
      const response = await app.inject({
        method: 'POST',
        path: '/v1/orders/draft',
      });

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('returns 422 if items not passed', async () => {
      const response = await app.inject({
        method: 'POST',
        path: '/v1/orders/draft',
        headers: {
          Authorization: accessToken,
        },
        payload: [],
      });

      expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);

      const body = JSON.parse(response.body);

      expect(body.errors[0].message[0]).toBe('No items found');
    });

    it('returns 422 if validation failed', async () => {
      const response = await app.inject({
        method: 'POST',
        path: '/v1/orders/draft',
        headers: {
          Authorization: accessToken,
        },
        payload: [
          {
            id: 12,
            productName: 'Test',
            unitPrice: 1.12,
            quantity: 2,
            pictureUrl: '',
          },
        ],
      });

      expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);

      const body = JSON.parse(response.body);

      expect(body.errors[0].message[0]).toBe('productId is required');
    });

    it('returns order draft', async () => {
      const response = await app.inject({
        method: 'POST',
        path: '/v1/orders/draft',
        headers: {
          Authorization: accessToken,
        },
        payload: [
          {
            id: 12,
            productId: 5,
            productName: 'Test',
            unitPrice: 1.12,
            quantity: 2,
            pictureUrl: 'pictureUrl',
          },
        ],
      });

      expect(response.statusCode).toBe(HttpStatus.CREATED);

      const body = JSON.parse(response.body);

      expect(body).toEqual({
        orderItems: [
          {
            pictureUrl: 'pictureUrl',
            productId: 5,
            productName: 'Test',
            unitPrice: 1.12,
            units: 2,
          },
        ],
        total: 2.24,
      });
    });
  });

  describe('/GET v1/orders/card-types', () => {
    it('returns 401 if Authorization token not passed', async () => {
      const response = await app.inject({
        method: 'GET',
        path: '/v1/orders/card-types',
      });

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('returns transformed records', async () => {
      const response = await app.inject({
        method: 'GET',
        path: '/v1/orders/card-types',
        headers: {
          Authorization: accessToken,
        },
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body).toEqual([
        {
          id: 1,
          name: 'Amex',
        },
        {
          id: 2,
          name: 'Visa',
        },
        {
          id: 3,
          name: 'MasterCard',
        },
        {
          id: 4,
          name: 'Capital One',
        },
      ]);
    });
  });

  describe('GracePeriodConfirmedEvent', () => {
    beforeEach(async () => {
      await client.connect();
    });

    afterEach(() => {
      client.close();
    });

    it('does not process if already has been received', async () => {
      const event = new GracePeriodConfirmedEvent(order.id);
      const connection = app.get(Connection);

      await connection
        .createQueryBuilder()
        .insert()
        .into('inbox')
        .values({ id: event.id })
        .execute();

      client.emit(event.name, event);
      // wait for async event handler is done
      await sleep(1000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await connection
        .getRepository('orders')
        .createQueryBuilder('order')
        .where('order.id = :id', { id: order.id })
        .getOne();

      expect(result.orderStatusId).toBe(order.orderStatusId);
    });

    it('changes order status to AWAITING_VALIDATION', async () => {
      const event = new GracePeriodConfirmedEvent(order.id);
      const connection = app.get(Connection);

      await connection
        .createQueryBuilder()
        .update('orders')
        .set({ orderStatusId: OrderStatus.SUBMITTED })
        .where({ id: order.id })
        .execute();

      client.emit(event.name, event);

      // wait for async event handler is done
      await sleep(1000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await connection
        .getRepository('orders')
        .createQueryBuilder('order')
        .where('order.id = :id', { id: order.id })
        .getOne();

      expect(result.orderStatusId).toBe(OrderStatus.AWAITING_VALIDATION);
    });
  });

  describe('OrderPaymentFailedEvent', () => {
    beforeEach(async () => {
      await client.connect();
    });

    afterEach(() => {
      client.close();
    });

    it('does not process if already has been received', async () => {
      const event = new OrderPaymentFailedEvent(order.id);
      const connection = app.get(Connection);

      await connection
        .createQueryBuilder()
        .insert()
        .into('inbox')
        .values({ id: event.id })
        .execute();

      client.emit(event.name, event);

      // wait for async event handler is done
      await sleep(1000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await connection
        .getRepository('orders')
        .createQueryBuilder('order')
        .where('order.id = :id', { id: order.id })
        .getOne();

      expect(result.orderStatusId).toBe(order.orderStatusId);
    });

    it('changes order status to CANCELLED', async () => {
      const event = new OrderPaymentFailedEvent(order.id);
      const connection = app.get(Connection);

      await connection
        .createQueryBuilder()
        .update('orders')
        .set({ orderStatusId: OrderStatus.SUBMITTED })
        .where({ id: order.id })
        .execute();

      client.emit(event.name, event);

      // wait for async event handler is done
      await sleep(1000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await connection
        .getRepository('orders')
        .createQueryBuilder('order')
        .where('order.id = :id', { id: order.id })
        .getOne();

      expect(result.orderStatusId).toBe(OrderStatus.CANCELLED);
    });
  });

  describe('OrderPaymentSucceededEvent', () => {
    beforeEach(async () => {
      await client.connect();
    });

    afterEach(() => {
      client.close();
    });

    it('does not process if already has been received', async () => {
      const event = new OrderPaymentSucceededEvent(order.id);
      const connection = app.get(Connection);

      await connection
        .createQueryBuilder()
        .insert()
        .into('inbox')
        .values({ id: event.id })
        .execute();

      client.emit(event.name, event);

      // wait for async event handler is done
      await sleep(1000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await connection
        .getRepository('orders')
        .createQueryBuilder('order')
        .where('order.id = :id', { id: order.id })
        .getOne();

      expect(result.orderStatusId).toBe(order.orderStatusId);
    });

    it('changes order status to PAID', async () => {
      const event = new OrderPaymentSucceededEvent(order.id);
      const connection = app.get(Connection);

      await connection
        .createQueryBuilder()
        .update('orders')
        .set({ orderStatusId: OrderStatus.STOCK_CONFIRMED })
        .where({ id: order.id })
        .execute();

      client.emit(event.name, event);

      // wait for async event handler is done
      await sleep(1000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await connection
        .getRepository('orders')
        .createQueryBuilder('order')
        .where('order.id = :id', { id: order.id })
        .getOne();

      expect(result.orderStatusId).toBe(OrderStatus.PAID);
    });
  });

  describe('OrderStockConfirmedEvent', () => {
    beforeEach(async () => {
      await client.connect();
    });

    afterEach(() => {
      client.close();
    });

    it('does not process if already has been received', async () => {
      const event = new OrderStockConfirmedEvent(order.id);
      const connection = app.get(Connection);

      await connection
        .createQueryBuilder()
        .insert()
        .into('inbox')
        .values({ id: event.id })
        .execute();

      client.emit(event.name, event);

      // wait for async event handler is done
      await sleep(1000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await connection
        .getRepository('orders')
        .createQueryBuilder('order')
        .where('order.id = :id', { id: order.id })
        .getOne();

      expect(result.orderStatusId).toBe(order.orderStatusId);
    });

    it('changes order status to STOCK_CONFIRMED', async () => {
      const event = new OrderStockConfirmedEvent(order.id);
      const connection = app.get(Connection);

      await connection
        .createQueryBuilder()
        .update('orders')
        .set({ orderStatusId: OrderStatus.AWAITING_VALIDATION })
        .where({ id: order.id })
        .execute();

      client.emit(event.name, event);

      // wait for async event handler is done
      await sleep(1000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await connection
        .getRepository('orders')
        .createQueryBuilder('order')
        .where('order.id = :id', { id: order.id })
        .getOne();

      expect(result.orderStatusId).toBe(OrderStatus.STOCK_CONFIRMED);
    });
  });

  describe('OrderStockRejectedEvent', () => {
    beforeEach(async () => {
      await client.connect();
    });

    afterEach(() => {
      client.close();
    });

    it('does not process if already has been received', async () => {
      const orderStockItems = orderItems.map(
        (item) => new ConfirmedOrderStockItem(item.productId, false)
      );
      const event = new OrderStockRejectedEvent(order.id, orderStockItems);
      const connection = app.get(Connection);

      await connection
        .createQueryBuilder()
        .insert()
        .into('inbox')
        .values({ id: event.id })
        .execute();

      client.emit(event.name, event);

      // wait for async event handler is done
      await sleep(1000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await connection
        .getRepository('orders')
        .createQueryBuilder('order')
        .where('order.id = :id', { id: order.id })
        .getOne();

      expect(result.orderStatusId).toBe(order.orderStatusId);
    });

    it('changes order status to CANCELLED', async () => {
      const orderStockItems = orderItems.map(
        (item) => new ConfirmedOrderStockItem(item.productId, false)
      );
      const event = new OrderStockRejectedEvent(order.id, orderStockItems);
      const connection = app.get(Connection);

      await connection
        .createQueryBuilder()
        .update('orders')
        .set({ orderStatusId: OrderStatus.AWAITING_VALIDATION })
        .where({ id: order.id })
        .execute();

      client.emit(event.name, event);

      // wait for async event handler is done
      await sleep(1000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await connection
        .getRepository('orders')
        .createQueryBuilder('order')
        .where('order.id = :id', { id: order.id })
        .getOne();

      expect(result.orderStatusId).toBe(OrderStatus.CANCELLED);
    });
  });

  describe('UserCheckoutAcceptedEvent', () => {
    let event: UserCheckoutAcceptedEvent;

    beforeEach(async () => {
      event = new UserCheckoutAcceptedEvent(
        buyer.identityGuid,
        buyer.name,
        'City',
        'Street',
        'State',
        'Country',
        '123456',
        '123412341234',
        'Test',
        new Date('2070-01-31'),
        '123',
        cardTypes[0].id,
        buyer.name,
        new CustomerBasket(buyer.id, [
          {
            id: '12',
            productId: 34,
            productName: 'Cup',
            unitPrice: 3.5,
            oldUnitPrice: 0,
            quantity: 3,
            pictureUrl: 'test',
          },
        ])
      );

      await client.connect();
    });

    afterEach(() => {
      client.close();
    });

    it('does not process if already has been received', async () => {
      const connection = app.get(Connection);

      await connection
        .createQueryBuilder()
        .insert()
        .into('inbox')
        .values({ id: event.id })
        .execute();

      client.emit(event.name, event);

      // wait for async event handler is done
      await sleep(1000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await connection
        .getRepository('orders')
        .createQueryBuilder('order')
        .getMany();

      expect(result.length).toBe(1);
    });

    it('creates new order with the same payment', async () => {
      const evt = new UserCheckoutAcceptedEvent(
        buyer.identityGuid,
        buyer.name,
        'City',
        'Street',
        'State',
        'Country',
        '123456',
        paymentMethod.cardNumber,
        'Test',
        new Date(paymentMethod.expiration),
        '123',
        paymentMethod.cardTypeId,
        buyer.name,
        new CustomerBasket(buyer.id, [
          {
            id: '12',
            productId: 34,
            productName: 'Cup',
            unitPrice: 3.5,
            oldUnitPrice: 0,
            quantity: 3,
            pictureUrl: 'test',
          },
        ])
      );
      const connection = app.get(Connection);

      client.emit(evt.name, evt);

      // wait for async event handler is done
      await sleep(1000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orders: any = await connection
        .getRepository('orders')
        .createQueryBuilder('order')
        .getMany();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paymentMethods: any = await connection
        .getRepository('payment_methods')
        .createQueryBuilder('payment_method')
        .getMany();

      expect(orders.length).toBe(2);
      expect(paymentMethods.length).toBe(1);
    });

    it('creates new order and new payment ', async () => {
      const connection = app.get(Connection);

      client.emit(event.name, event);

      // wait for async event handler is done
      await sleep(1000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orders: any = await connection
        .getRepository('orders')
        .createQueryBuilder('order')
        .getMany();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paymentMethods: any = await connection
        .getRepository('payment_methods')
        .createQueryBuilder('payment_method')
        .getMany();

      expect(orders.length).toBe(2);
      expect(paymentMethods.length).toBe(2);
    });

    it('creates new order, new buyer and new payment method', async () => {
      const evt = new UserCheckoutAcceptedEvent(
        randomUUID(),
        'New Buyer',
        'City',
        'Street',
        'State',
        'Country',
        '123456',
        '123412341234',
        'Test',
        new Date('2070-01-31'),
        '123',
        cardTypes[0].id,
        'New buyer',
        new CustomerBasket(undefined, [
          {
            id: '12',
            productId: 34,
            productName: 'Cup',
            unitPrice: 3.5,
            oldUnitPrice: 0,
            quantity: 3,
            pictureUrl: 'test',
          },
        ])
      );
      const connection = app.get(Connection);

      client.emit(evt.name, evt);

      // wait for async event handler is done
      await sleep(1000);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orders: any = await connection
        .getRepository('orders')
        .createQueryBuilder('order')
        .getMany();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const buyers: any = await connection
        .getRepository('buyers')
        .createQueryBuilder('buyer')
        .getMany();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paymentMethods: any = await connection
        .getRepository('payment_methods')
        .createQueryBuilder('payment_method')
        .getMany();

      expect(orders.length).toBe(2);
      expect(buyers.length).toBe(2);
      expect(paymentMethods.length).toBe(2);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
