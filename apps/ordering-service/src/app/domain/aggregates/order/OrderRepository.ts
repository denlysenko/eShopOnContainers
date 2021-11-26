import { Order } from './Order';

export interface OrderRepository {
  queryOrder(id: number, buyerId: number): Promise<unknown>;
  queryOrdersFromUser(userId: string): Promise<unknown[]>;
  queryCardTypes(): Promise<unknown[]>;
  getOrder(id: number): Promise<Order>;
  // TODO: save also order items in one transaction
  addOrder(order: Order): Promise<Order>;
  updateOrder(order: Order): Promise<void>;
  nextOrderId(): Promise<number>;
  nextOrderItemId(): Promise<number>;
}

export const ORDER_REPOSITORY = Symbol('OrderRepository');
