import { IntegrationEvent } from '@e-shop-on-containers/event-bus';

export class OrderStatusChangedToSubmittedEvent extends IntegrationEvent {
  public readonly name = OrderStatusChangedToSubmittedEvent.name;

  constructor(
    public readonly orderId: number,
    public readonly orderStatus: string,
    public readonly buyerName: string
  ) {
    super();
  }
}
