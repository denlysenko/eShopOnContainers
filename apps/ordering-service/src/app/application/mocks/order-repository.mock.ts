import { OrderRepository } from '../../domain';

export const ordersRepositoryMock: OrderRepository = {
  nextOrderItemId: jest.fn(),
  queryOrder: jest.fn(),
  getOrder: jest.fn(),
  queryOrdersFromUser: jest.fn(),
  queryCardTypes: jest.fn(),
  nextOrderId: jest.fn(),
  addOrder: jest.fn(),
  updateOrder: jest.fn()
};
