import { Order } from '../aggregates/order/Order';
import { IDomainEvent } from './IDomainEvent';

export class OrderStartedDomainEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly order: Order,
    public readonly userId: string,
    public readonly userName: string,
    public readonly cardTypeId: number,
    public readonly cardNumber: string,
    public readonly cardSecurityNumber: string,
    public readonly cardHolderName: string,
    public readonly cardExpiration: Date
  ) {}

  public getAggregateId(): number {
    return this.order.id;
  }
}
