import { loggerMock } from '../mocks/logger.mock';
import { CreateOrderDraftCommand } from './CreateOrderDraftCommand';
import { CreateOrderDraftCommandHandler } from './CreateOrderDraftCommandHandler';

const buyerId = 'buyer_id';
const items = [
  {
    id: 'product_1',
    productId: 12,
    productName: 'Product 1',
    quantity: 2,
    unitPrice: 1.25,
    oldUnitPrice: null,
    pictureUrl: '',
  },
  {
    id: 'product_2',
    productId: 8,
    productName: 'Product 2',
    quantity: 1,
    unitPrice: 3.5,
    oldUnitPrice: null,
    pictureUrl: '',
  },
];

describe('CreateOrderDraftCommandHandler', () => {
  let handler: CreateOrderDraftCommandHandler;

  beforeEach(() => {
    handler = new CreateOrderDraftCommandHandler(loggerMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should return OrderDraftDto', async () => {
    const command = new CreateOrderDraftCommand(buyerId, items);

    const result = await handler.handle(command);

    expect(result.data).toEqual({
      orderItems: items.map((item) => ({
        discount: undefined,
        pictureUrl: item.pictureUrl,
        productId: item.productId,
        productName: item.productName,
        unitPrice: item.unitPrice,
        units: item.quantity,
      })),
      total: items.reduce((acc, item) => {
        acc += item.unitPrice * item.quantity;

        return acc;
      }, 0),
    });
  });
});
