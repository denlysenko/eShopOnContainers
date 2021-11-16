import { IntegrationEvent } from '@e-shop-on-containers/event-bus';
import { CustomerBasket } from '../../models/customer-basket.model';

export class UserCheckoutAcceptedEvent extends IntegrationEvent {
  public readonly name = UserCheckoutAcceptedEvent.name;

  constructor(
    public readonly userId: string,
    public readonly userName: string,
    public readonly city: string,
    public readonly street: string,
    public readonly state: string,
    public readonly country: string,
    public readonly zipCode: string,
    public readonly cardNumber: string,
    public readonly cardHolderName: string,
    public readonly cardExpiration: Date,
    public readonly cardSecurityNumber: string,
    public readonly cardTypeId: number,
    public readonly buyer: string,
    public readonly basket: CustomerBasket
  ) {
    super();
  }
}
