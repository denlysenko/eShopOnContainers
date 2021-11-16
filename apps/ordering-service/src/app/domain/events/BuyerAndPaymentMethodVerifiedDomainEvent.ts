import { Buyer } from '../aggregates/buyer/Buyer';
import { PaymentMethod } from '../aggregates/buyer/PaymentMethod';
import { IDomainEvent } from './IDomainEvent';

export class BuyerAndPaymentMethodVerifiedDomainEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();

  constructor(
    public readonly buyer: Buyer,
    public readonly payment: PaymentMethod,
    public readonly orderId: number
  ) {}

  public getAggregateId(): number {
    return this.buyer.id;
  }
}
