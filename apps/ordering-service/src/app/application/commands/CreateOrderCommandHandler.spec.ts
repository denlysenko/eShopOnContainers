import { loggerMock } from '../mocks/logger.mock';
import { ordersRepositoryMock } from '../mocks/order-repository.mock';
import { outboxRepositoryMock } from '../mocks/outbox-repository.mock';
import { unitOfWorkMock } from '../mocks/unit-of-work.mock';
import { CreateOrderCommand } from './CreateOrderCommand';
import { CreateOrderCommandHandler } from './CreateOrderCommandHandler';

const nextOrderId = 2;
const nextOrderItemId = 5;
const command = new CreateOrderCommand(
  [
    {
      id: 'product_1',
      productId: 12,
      productName: 'Product 1',
      quantity: 2,
      unitPrice: 1.25,
      oldUnitPrice: null,
      pictureUrl: '',
    },
  ],
  'user_id',
  'userName',
  'City',
  'Street',
  'State',
  'Country',
  '12345',
  '1234567899',
  'user',
  new Date(Date.now() + 1000 * 60 * 60 * 24),
  '123',
  3
);

describe('CreateOrderCommandHandler', () => {
  let handler: CreateOrderCommandHandler;

  beforeEach(() => {
    handler = new CreateOrderCommandHandler(
      ordersRepositoryMock,
      outboxRepositoryMock,
      unitOfWorkMock,
      loggerMock
    );
    jest
      .spyOn(ordersRepositoryMock, 'nextOrderId')
      .mockResolvedValue(nextOrderId);
    jest
      .spyOn(ordersRepositoryMock, 'nextOrderItemId')
      .mockResolvedValue(nextOrderItemId);
    jest.spyOn(ordersRepositoryMock, 'addOrder').mockResolvedValue(undefined);
    jest.spyOn(outboxRepositoryMock, 'create').mockResolvedValue(undefined);
    jest
      .spyOn(unitOfWorkMock, 'withTransaction')
      .mockImplementation(async (callback: () => void) => {
        await callback();
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should get next order id from repository', async () => {
    await handler.handle(command);
    expect(ordersRepositoryMock.nextOrderId).toHaveBeenCalled();
  });

  it('should get next order item id from repository', async () => {
    await handler.handle(command);
    expect(ordersRepositoryMock.nextOrderItemId).toHaveBeenCalled();
  });

  it('should add order to repository', async () => {
    await handler.handle(command);
    expect(ordersRepositoryMock.addOrder).toHaveBeenCalled();
  });

  it('should add event to outbox repository', async () => {
    await handler.handle(command);
    expect(outboxRepositoryMock.create).toHaveBeenCalled();
  });

  it('should return Result.fail if order to repository failed', async () => {
    const error = new Error('Error');
    jest.spyOn(ordersRepositoryMock, 'addOrder').mockRejectedValueOnce(error);

    expect(await handler.handle(command)).toEqual(
      expect.objectContaining({ success: false, error })
    );
  });

  it('should return Result.fail if adding to outbox repository failed', async () => {
    const error = new Error('Error');
    jest.spyOn(outboxRepositoryMock, 'create').mockRejectedValueOnce(error);

    expect(await handler.handle(command)).toEqual(
      expect.objectContaining({ success: false, error })
    );
  });

  it('should return Result.ok', async () => {
    expect(await handler.handle(command)).toEqual(
      expect.objectContaining({ success: true })
    );
  });
});
