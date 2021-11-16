import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { cardTypeMock } from '../mocks/card-type.mock';
import { ordersRepositoryMock } from '../mocks/order-repository.mock';
import { orderSummaryMock } from '../mocks/order-summary.mock';
import { orderMock } from '../mocks/order.mock';
import { OrderQueries } from './order.queries';

describe('OrderQueries', () => {
  let service: OrderQueries;

  beforeEach(() => {
    service = new OrderQueries(ordersRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('queryOrder', () => {
    beforeEach(() => {
      jest
        .spyOn(ordersRepositoryMock, 'queryOrder')
        .mockResolvedValue(orderMock);
    });

    it('should call getOrder with correct param', async () => {
      await service.getOrder(orderMock.id);

      expect(ordersRepositoryMock.queryOrder).toHaveBeenCalledWith(
        orderMock.id
      );
    });

    it('should throw EntityNotFoundException', async () => {
      jest
        .spyOn(ordersRepositoryMock, 'queryOrder')
        .mockResolvedValueOnce(null);

      try {
        await service.getOrder(orderMock.id);
      } catch (error) {
        expect(error).toBeInstanceOf(EntityNotFoundException);
        expect(error.message).toEqual(
          `Order with id ${orderMock.id} not found`
        );
      }
    });

    it('should transform to OrderReadDto', async () => {
      expect(await service.getOrder(orderMock.id)).toEqual({
        orderNumber: 1,
        street: 'Street',
        city: 'City',
        zipCode: '123456',
        country: 'Country',
        date: '2021-10-10T12:40:20.288Z',
        description: null,
        orderItems: [
          {
            productName: 'Product 1',
            units: 2,
            unitPrice: 1.25,
            pictureUrl: '',
          },
          {
            productName: 'Product 2',
            units: 1,
            unitPrice: 3.5,
            pictureUrl: '',
          },
        ],
        status: 'New',
      });
    });
  });

  describe('queryOrdersFromUser', () => {
    const userId = 'user_id';

    beforeEach(() => {
      jest
        .spyOn(ordersRepositoryMock, 'queryOrdersFromUser')
        .mockResolvedValue([orderSummaryMock]);
    });

    it('should call getOrdersFromUser with correct param', async () => {
      await service.getOrdersFromUser(userId);

      expect(ordersRepositoryMock.queryOrdersFromUser).toHaveBeenCalledWith(
        userId
      );
    });

    it('should transform to OrderSummaryDto', async () => {
      expect(await service.getOrdersFromUser(userId)).toEqual([
        {
          orderNumber: 2,
          date: '2021-10-10T12:40:20.288Z',
          status: 'Shipped',
          total: 12,
        },
      ]);
    });
  });

  describe('queryCardTypes', () => {
    beforeEach(() => {
      jest
        .spyOn(ordersRepositoryMock, 'queryCardTypes')
        .mockResolvedValue([cardTypeMock]);
    });

    it('should call getCardTypes', async () => {
      await ordersRepositoryMock.queryCardTypes();

      expect(ordersRepositoryMock.queryCardTypes).toHaveBeenCalled();
    });

    it('should transform to CardTypeReadDto', async () => {
      expect(await ordersRepositoryMock.queryCardTypes()).toEqual([
        {
          id: 3,
          name: 'Visa',
        },
      ]);
    });
  });
});
