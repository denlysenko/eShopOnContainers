import { ILogger } from '@e-shop-on-containers/logger';
import {
  BuyerRepository,
  DomainEvents,
  OrderRepository,
  OrderStatus,
  OrderStatusChangedToPaidDomainEvent,
} from '../../../domain';
import { OutboxRepository } from '../../repositories/outbox.repository';
import { OrderStockItem } from '../integration/order-status-changed-to-awaiting-validation.event';
import { OrderStatusChangedToPaidEvent } from '../integration/order-status-changed-to-paid.event';

export class OrderStatusChangedToPaidDomainEventHandler {
  constructor(
    private readonly _orderRepository: OrderRepository,
    private readonly _buyerRepository: BuyerRepository,
    private readonly _outboxRepository: OutboxRepository,
    private readonly _logger: ILogger
  ) {
    DomainEvents.register(
      this._onOrderStatusChangedToPaid.bind(this),
      OrderStatusChangedToPaidDomainEvent.name
    );
  }

  private async _onOrderStatusChangedToPaid(
    event: OrderStatusChangedToPaidDomainEvent
  ): Promise<void> {
    this._logger.debug(
      `Order with id: ${event.orderId} has been successfully updated to status ${OrderStatus.PAID}`
    );

    const order = await this._orderRepository.getOrder(event.orderId);
    const buyer = await this._buyerRepository.findById(order.buyerId);

    const orderStockItems = event.orderItems.map(
      (item) => new OrderStockItem(item.productId, item.units)
    );

    const orderStatusChangedToPaidEvent = new OrderStatusChangedToPaidEvent(
      order.id,
      OrderStatus[order.orderStatusId],
      buyer.name,
      orderStockItems
    );

    await this._outboxRepository.create({
      id: orderStatusChangedToPaidEvent.id,
      payload: JSON.stringify(orderStatusChangedToPaidEvent),
    });
  }
}
