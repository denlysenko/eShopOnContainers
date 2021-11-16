import { OrderStatus } from '../../domain';
import { OrdersMapper } from '../mappers/orders.mapper';
import { loggerMock } from '../mocks/logger.mock';
import { orderRawMock } from '../mocks/order-raw.mock';
import { ordersRepositoryMock } from '../mocks/order-repository.mock';
import { SetPaidStatusCommand } from './SetPaidStatusCommand';
import { SetStockConfirmedStatusCommand } from './SetStockConfirmedStatusCommand';
import { SetStockConfirmedStatusCommandHandler } from './SetStockConfirmedStatusCommandHandler';

const orderNumber = 1;

describe('SetStockConfirmedStatusCommandHandler', () => {
  let handler: SetStockConfirmedStatusCommandHandler;

  beforeEach(() => {
    handler = new SetStockConfirmedStatusCommandHandler(
      ordersRepositoryMock,
      loggerMock
    );
    jest.spyOn(ordersRepositoryMock, 'getOrder').mockResolvedValue(
      OrdersMapper.toDomain({
        ...orderRawMock,
        orderStatusId: OrderStatus.AWAITING_VALIDATION,
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
    await handler.handle(new SetStockConfirmedStatusCommand(orderNumber));

    expect(ordersRepositoryMock.getOrder).toHaveBeenCalledWith(orderNumber);
  });

  it('should return Result.fail if order not found', async () => {
    jest.spyOn(ordersRepositoryMock, 'getOrder').mockResolvedValueOnce(null);

    expect(await handler.handle(new SetStockConfirmedStatusCommand(2))).toEqual(
      expect.objectContaining({ success: false })
    );
  });

  it('should update order repository with initial status', async () => {
    jest
      .spyOn(ordersRepositoryMock, 'getOrder')
      .mockResolvedValueOnce(OrdersMapper.toDomain(orderRawMock));

    await handler.handle(new SetStockConfirmedStatusCommand(orderNumber));

    expect(ordersRepositoryMock.updateOrder).toHaveBeenCalledWith(
      expect.objectContaining({ _orderStatusId: OrderStatus.SUBMITTED })
    );
  });

  it('should update order repository with new status', async () => {
    await handler.handle(new SetStockConfirmedStatusCommand(orderNumber));

    expect(ordersRepositoryMock.updateOrder).toHaveBeenCalledWith(
      expect.objectContaining({ _orderStatusId: OrderStatus.STOCK_CONFIRMED })
    );
  });

  it('should return Result.fail if update repository failed', async () => {
    const error = new Error('Error');
    jest
      .spyOn(ordersRepositoryMock, 'updateOrder')
      .mockRejectedValueOnce(error);

    expect(
      await handler.handle(new SetStockConfirmedStatusCommand(orderNumber))
    ).toEqual(expect.objectContaining({ success: false, error }));
  });

  it('should return Result.ok if order updated', async () => {
    expect(await handler.handle(new SetPaidStatusCommand(orderNumber))).toEqual(
      expect.objectContaining({ success: true })
    );
  });
});
