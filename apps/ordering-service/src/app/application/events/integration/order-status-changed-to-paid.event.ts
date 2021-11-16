import { IntegrationEvent } from '@e-shop-on-containers/event-bus';
import { OrderStockItem } from './order-status-changed-to-awaiting-validation.event';

export class OrderStatusChangedToPaidEvent extends IntegrationEvent {
  public readonly name = OrderStatusChangedToPaidEvent.name;

  constructor(
    public readonly orderId: number,
    public readonly orderStatus: string,
    public readonly buyerName: string,
    public readonly orderStockItems: OrderStockItem[]
  ) {
    super();
  }
}
