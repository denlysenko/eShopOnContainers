import { OrderStatus } from '../../domain';
import { OrdersMapper } from '../mappers/orders.mapper';
import { loggerMock } from '../mocks/logger.mock';
import { orderRawMock } from '../mocks/order-raw.mock';
import { ordersRepositoryMock } from '../mocks/order-repository.mock';
import { SetPaidStatusCommand } from './SetPaidStatusCommand';
import { SetPaidStatusCommandHandler } from './SetPaidStatusCommandHandler';

const orderNumber = 1;

describe('SetPaidStatusCommandHandler', () => {
  let handler: SetPaidStatusCommandHandler;

  beforeEach(() => {
    handler = new SetPaidStatusCommandHandler(ordersRepositoryMock, loggerMock);
    jest.spyOn(ordersRepositoryMock, 'getOrder').mockResolvedValue(
      OrdersMapper.toDomain({
        ...orderRawMock,
        orderStatusId: OrderStatus.STOCK_CONFIRMED,
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
    await handler.handle(new SetPaidStatusCommand(orderNumber));

    expect(ordersRepositoryMock.getOrder).toHaveBeenCalledWith(orderNumber);
  });

  it('should return Result.fail if order not found', async () => {
    jest.spyOn(ordersRepositoryMock, 'getOrder').mockResolvedValueOnce(null);

    expect(await handler.handle(new SetPaidStatusCommand(2))).toEqual(
      expect.objectContaining({ success: false })
    );
  });

  it('should update order repository with initial status', async () => {
    jest
      .spyOn(ordersRepositoryMock, 'getOrder')
      .mockResolvedValueOnce(OrdersMapper.toDomain(orderRawMock));

    await handler.handle(new SetPaidStatusCommand(orderNumber));

    expect(ordersRepositoryMock.updateOrder).toHaveBeenCalledWith(
      expect.objectContaining({ _orderStatusId: OrderStatus.SUBMITTED })
    );
  });

  it('should update order repository', async () => {
    await handler.handle(new SetPaidStatusCommand(orderNumber));

    expect(ordersRepositoryMock.updateOrder).toHaveBeenCalledWith(
      expect.objectContaining({ _orderStatusId: OrderStatus.PAID })
    );
  });

  it('should return Result.fail if update repository failed', async () => {
    const error = new Error('Error');
    jest
      .spyOn(ordersRepositoryMock, 'updateOrder')
      .mockRejectedValueOnce(error);

    expect(await handler.handle(new SetPaidStatusCommand(orderNumber))).toEqual(
      expect.objectContaining({ success: false, error })
    );
  });

  it('should return Result.ok if order updated', async () => {
    expect(await handler.handle(new SetPaidStatusCommand(orderNumber))).toEqual(
      expect.objectContaining({ success: true })
    );
  });
});
