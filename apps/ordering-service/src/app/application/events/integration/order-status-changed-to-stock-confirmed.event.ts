import { IntegrationEvent } from '@e-shop-on-containers/event-bus';

export class OrderStatusChangedToStockConfirmedEvent extends IntegrationEvent {
  public readonly name = OrderStatusChangedToStockConfirmedEvent.name;

  constructor(
    public readonly orderId: number,
    public readonly orderStatus: string,
    public readonly buyerName: string
  ) {
    super();
  }
}
