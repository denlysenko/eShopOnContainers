import { IntegrationEvent } from '@e-shop-on-containers/event-bus';

export class OrderStockConfirmedEvent extends IntegrationEvent {
  public readonly name = OrderStockConfirmedEvent.name;

  constructor(public readonly orderId: number) {
    super();
  }
}
