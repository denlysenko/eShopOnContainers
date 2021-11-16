import { OrderStatus } from '../../domain';
import { OrdersMapper } from '../mappers/orders.mapper';
import { loggerMock } from '../mocks/logger.mock';
import { orderRawMock } from '../mocks/order-raw.mock';
import { ordersRepositoryMock } from '../mocks/order-repository.mock';
import { SetAwaitingValidationStatusCommand } from './SetAwaitingValidationStatusCommand';
import { SetAwaitingValidationStatusCommandHandler } from './SetAwaitingValidationStatusCommandHandler';

const orderNumber = 1;

describe('SetAwaitingValidationStatusCommandHandler', () => {
  let handler: SetAwaitingValidationStatusCommandHandler;

  beforeEach(() => {
    handler = new SetAwaitingValidationStatusCommandHandler(
      ordersRepositoryMock,
      loggerMock
    );
    jest
      .spyOn(ordersRepositoryMock, 'getOrder')
      .mockResolvedValue(OrdersMapper.toDomain(orderRawMock));
    jest
      .spyOn(ordersRepositoryMock, 'updateOrder')
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should get order from repository', async () => {
    await handler.handle(new SetAwaitingValidationStatusCommand(orderNumber));

    expect(ordersRepositoryMock.getOrder).toHaveBeenCalledWith(orderNumber);
  });

  it('should return Result.fail if order not found', async () => {
    jest.spyOn(ordersRepositoryMock, 'getOrder').mockResolvedValueOnce(null);

    expect(
      await handler.handle(new SetAwaitingValidationStatusCommand(2))
    ).toEqual(expect.objectContaining({ success: false }));
  });

  it('should update order repository', async () => {
    await handler.handle(new SetAwaitingValidationStatusCommand(orderNumber));

    expect(ordersRepositoryMock.updateOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        _orderStatusId: OrderStatus.AWAITING_VALIDATION,
      })
    );
  });

  it('should return Result.fail if update repository failed', async () => {
    const error = new Error('Error');
    jest
      .spyOn(ordersRepositoryMock, 'updateOrder')
      .mockRejectedValueOnce(error);

    expect(
      await handler.handle(new SetAwaitingValidationStatusCommand(orderNumber))
    ).toEqual(expect.objectContaining({ success: false, error }));
  });

  it('should return Result.ok if order updated', async () => {
    expect(
      await handler.handle(new SetAwaitingValidationStatusCommand(orderNumber))
    ).toEqual(expect.objectContaining({ success: true }));
  });
});
