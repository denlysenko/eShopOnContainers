import { Order } from '../aggregates/order/Order';
import { IDomainEvent } from './IDomainEvent';

export class OrderShippedDomainEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(public readonly order: Order) {}

  public getAggregateId(): number {
    return this.order.id;
  }
}
