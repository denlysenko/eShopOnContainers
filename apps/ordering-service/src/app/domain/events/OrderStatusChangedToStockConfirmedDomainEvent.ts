import { IDomainEvent } from './IDomainEvent';

export class OrderStatusChangedToStockConfirmedDomainEvent
  implements IDomainEvent
{
  public readonly dateTimeOccurred: Date = new Date();

  constructor(public readonly orderId: number) {}

  public getAggregateId(): number {
    return this.orderId;
  }
}
