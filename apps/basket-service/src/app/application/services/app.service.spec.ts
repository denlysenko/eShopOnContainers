import 'reflect-metadata';
import { BasketCheckoutDto } from '../dto/basket-checkout.dto';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { AppService } from './app.service';
import { basketRepositoryMock } from './mocks/basket-repository.mock';
import { basketMock } from './mocks/basket.mock';
import { outboxRepositoryMock } from './mocks/outbox-repository.mock';
import { unitOfWorkMock } from './mocks/unit-of-work.mock';

const customerId = 'customer_id';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService(
      basketRepositoryMock,
      outboxRepositoryMock,
      unitOfWorkMock
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBasketById', () => {
    beforeEach(() => {
      jest
        .spyOn(basketRepositoryMock, 'getBasket')
        .mockResolvedValue(basketMock);
    });

    it('returns empty array if basket not found', async () => {
      jest
        .spyOn(basketRepositoryMock, 'getBasket')
        .mockResolvedValueOnce(undefined);

      expect(await service.getBasketById(customerId)).toEqual({
        buyerId: customerId,
        basketItems: [],
      });
    });

    it('returns basket', async () => {
      expect(await service.getBasketById(customerId)).toEqual({
        buyerId: basketMock.buyerId,
        basketItems: [
          {
            id: basketMock.basketItems[0].id,
            productId: basketMock.basketItems[0].productId,
            productName: basketMock.basketItems[0].productName,
            unitPrice: basketMock.basketItems[0].unitPrice,
            oldUnitPrice: basketMock.basketItems[0].oldUnitPrice,
            quantity: basketMock.basketItems[0].quantity,
            pictureUrl: basketMock.basketItems[0].pictureUrl,
          },
          {
            id: basketMock.basketItems[1].id,
            productId: basketMock.basketItems[1].productId,
            productName: basketMock.basketItems[1].productName,
            unitPrice: basketMock.basketItems[1].unitPrice,
            oldUnitPrice: basketMock.basketItems[1].oldUnitPrice,
            quantity: basketMock.basketItems[1].quantity,
            pictureUrl: basketMock.basketItems[1].pictureUrl,
          },
        ],
      });
    });
  });

  describe('updateBasket', () => {
    beforeEach(() => {
      jest
        .spyOn(basketRepositoryMock, 'updateBasket')
        .mockResolvedValue(undefined);
    });

    it('returns updated basket', async () => {
      const basketItemsDto = [
        {
          productId: 8,
          productName: 'Fork',
          unitPrice: 0.12,
          oldUnitPrice: 0,
          quantity: 10,
          pictureUrl: 'fork.png',
        },
      ];

      expect(await service.updateBasket(customerId, basketItemsDto)).toEqual({
        buyerId: customerId,
        basketItems: [
          {
            id: undefined,
            productId: basketItemsDto[0].productId,
            productName: basketItemsDto[0].productName,
            unitPrice: basketItemsDto[0].unitPrice,
            oldUnitPrice: basketItemsDto[0].oldUnitPrice,
            quantity: basketItemsDto[0].quantity,
            pictureUrl: basketItemsDto[0].pictureUrl,
          },
        ],
      });
    });
  });

  describe('checkout', () => {
    let basketCheckoutDto: BasketCheckoutDto;

    beforeEach(() => {
      jest
        .spyOn(unitOfWorkMock, 'withTransaction')
        .mockImplementation(async (callback: () => void) => {
          await callback();
        });

      jest
        .spyOn(basketRepositoryMock, 'getBasket')
        .mockResolvedValue(basketMock);

      jest
        .spyOn(basketRepositoryMock, 'deleteBasket')
        .mockResolvedValue(undefined);

      jest.spyOn(outboxRepositoryMock, 'create').mockResolvedValue(undefined);

      basketCheckoutDto = {
        city: 'City',
        street: 'Street',
        state: 'State',
        country: 'Country',
        zipCode: '123456',
        cardNumber: '1234123412341234',
        cardHolderName: 'Test',
        cardExpiration: '2070-01-31T00:00:00.000Z',
        cardSecurityNumber: '123',
        cardTypeId: 1,
        buyer: 'Test',
      };
    });

    it('throws EntityNotFoundException if basket does not exist', async () => {
      jest.spyOn(basketRepositoryMock, 'getBasket').mockResolvedValueOnce(null);

      try {
        await service.checkout(customerId, basketCheckoutDto);
      } catch (error) {
        expect(error).toBeInstanceOf(EntityNotFoundException);
        expect(error.message).toBe(
          `Basket for customer ${customerId} not found`
        );
      }
    });

    it('creates event in outbox and deletes basket', async () => {
      await service.checkout(customerId, basketCheckoutDto);
      expect(outboxRepositoryMock.create).toHaveBeenCalled();
      expect(basketRepositoryMock.deleteBasket).toHaveBeenCalled();
    });
  });

  describe('deleteBasket', () => {
    beforeEach(() => {
      jest
        .spyOn(basketRepositoryMock, 'getBasket')
        .mockResolvedValue(basketMock);

      jest
        .spyOn(basketRepositoryMock, 'deleteBasket')
        .mockResolvedValue(undefined);
    });

    it('throws EntityNotFoundException if basket does not exist', async () => {
      jest.spyOn(basketRepositoryMock, 'getBasket').mockResolvedValueOnce(null);

      try {
        await service.deleteBasket(customerId);
      } catch (error) {
        expect(error).toBeInstanceOf(EntityNotFoundException);
        expect(error.message).toBe(
          `Basket for customer ${customerId} not found`
        );
      }
    });

    it('deletes basket', async () => {
      await service.deleteBasket(customerId);
      expect(basketRepositoryMock.deleteBasket).toHaveBeenCalledWith(
        customerId
      );
    });
  });
});
