import { IntegrationEvent } from '@e-shop-on-containers/event-bus';

export class OrderStockItem {
  constructor(
    public readonly productId: number,
    public readonly units: number
  ) {}
}

export class OrderStatusChangedToAwaitingValidationEvent extends IntegrationEvent {
  public readonly name = OrderStatusChangedToAwaitingValidationEvent.name;

  constructor(
    public readonly orderId: number,
    public readonly orderStatus: string,
    public readonly buyerName: string,
    public readonly orderStockItems: OrderStockItem[]
  ) {
    super();
  }
}
