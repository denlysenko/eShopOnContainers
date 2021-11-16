import { OrderItem } from '../aggregates/order/OrderItem';
import { IDomainEvent } from './IDomainEvent';

export class OrderStatusChangedToPaidDomainEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly orderId: number,
    public readonly orderItems: OrderItem[]
  ) {}

  public getAggregateId(): number {
    return this.orderId;
  }
}
