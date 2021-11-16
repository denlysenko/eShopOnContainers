import { IntegrationEvent } from '@e-shop-on-containers/event-bus';

export class ConfirmedOrderStockItem {
  constructor(
    public readonly productId: number,
    public readonly hasStock: boolean
  ) {}
}

export class OrderStockRejectedEvent extends IntegrationEvent {
  public readonly name = OrderStockRejectedEvent.name;

  constructor(
    public readonly orderId: number,
    public readonly orderStockItems: ConfirmedOrderStockItem[]
  ) {
    super();
  }
}
