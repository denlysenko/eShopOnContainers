import { IntegrationEvent } from '@e-shop-on-containers/event-bus';

export class OrderStatusChangedToCancelledEvent extends IntegrationEvent {
  public readonly name = OrderStatusChangedToCancelledEvent.name;

  constructor(
    public readonly orderId: number,
    public readonly orderStatus: string,
    public readonly buyerName: string
  ) {
    super();
  }
}
