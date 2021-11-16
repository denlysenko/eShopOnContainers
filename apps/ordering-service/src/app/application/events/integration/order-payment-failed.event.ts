import { IntegrationEvent } from '@e-shop-on-containers/event-bus';

export class OrderPaymentFailedEvent extends IntegrationEvent {
  public readonly name = OrderPaymentFailedEvent.name;

  constructor(public readonly orderId: number) {
    super();
  }
}
