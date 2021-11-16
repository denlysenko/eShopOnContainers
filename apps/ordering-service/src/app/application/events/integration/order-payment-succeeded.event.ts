import { IntegrationEvent } from '@e-shop-on-containers/event-bus';

export class OrderPaymentSucceededEvent extends IntegrationEvent {
  public readonly name = OrderPaymentSucceededEvent.name;

  constructor(public readonly orderId: number) {
    super();
  }
}
