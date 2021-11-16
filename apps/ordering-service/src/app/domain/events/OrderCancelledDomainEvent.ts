import { Order } from '../aggregates/order/Order';
import { IDomainEvent } from './IDomainEvent';

export class OrderCancelledDomainEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(public readonly order: Order) {}

  public getAggregateId(): number {
    return this.order.id;
  }
}
