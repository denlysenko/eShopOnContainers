import { OrderingDomainException, OrderStatus } from '../../domain';
import { OrdersMapper } from '../mappers/orders.mapper';
import { loggerMock } from '../mocks/logger.mock';
import { orderRawMock } from '../mocks/order-raw.mock';
import { ordersRepositoryMock } from '../mocks/order-repository.mock';
import { ShipOrderCommand } from './ShipOrderCommand';
import { ShipOrderCommandHandler } from './ShipOrderCommandHandler';

const orderNumber = 1;

describe('ShipOrderCommandHandler', () => {
  let handler: ShipOrderCommandHandler;

  beforeEach(() => {
    handler = new ShipOrderCommandHandler(ordersRepositoryMock, loggerMock);
    jest.spyOn(ordersRepositoryMock, 'getOrder').mockResolvedValue(
      OrdersMapper.toDomain({
        ...orderRawMock,
        orderStatusId: OrderStatus.PAID,
      })
    );
    jest
      .spyOn(ordersRepositoryMock, 'updateOrder')
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should get order from repository', async () => {
    await handler.handle(new ShipOrderCommand(orderNumber));

    expect(ordersRepositoryMock.getOrder).toHaveBeenCalledWith(orderNumber);
  });

  it('should return Result.fail if order not found', async () => {
    jest.spyOn(ordersRepositoryMock, 'getOrder').mockResolvedValueOnce(null);

    expect(await handler.handle(new ShipOrderCommand(2))).toEqual(
      expect.objectContaining({ success: false })
    );
  });

  it('should return Result.fail if order is not paid', async () => {
    const error = new OrderingDomainException(
      `Is not possible to change the order status from ${
        OrderStatus[OrderStatus.SUBMITTED]
      } to ${OrderStatus[OrderStatus.SHIPPED]}`
    );

    jest
      .spyOn(ordersRepositoryMock, 'getOrder')
      .mockResolvedValueOnce(OrdersMapper.toDomain(orderRawMock));

    expect(await handler.handle(new ShipOrderCommand(orderNumber))).toEqual(
      expect.objectContaining({ success: false, error })
    );
  });

  it('should update order repository', async () => {
    await handler.handle(new ShipOrderCommand(orderNumber));

    expect(ordersRepositoryMock.updateOrder).toHaveBeenCalledWith(
      expect.objectContaining({ _orderStatusId: OrderStatus.SHIPPED })
    );
  });

  it('should return Result.fail if update repository failed', async () => {
    const error = new Error('Error');
    jest
      .spyOn(ordersRepositoryMock, 'updateOrder')
      .mockRejectedValueOnce(error);

    expect(await handler.handle(new ShipOrderCommand(orderNumber))).toEqual(
      expect.objectContaining({ success: false, error })
    );
  });

  it('should return Result.ok if order updated', async () => {
    expect(await handler.handle(new ShipOrderCommand(orderNumber))).toEqual(
      expect.objectContaining({ success: true })
    );
  });
});
