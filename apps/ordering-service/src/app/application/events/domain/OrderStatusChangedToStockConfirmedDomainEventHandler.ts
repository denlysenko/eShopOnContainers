import { ILogger } from '@e-shop-on-containers/logger';
import {
  BuyerRepository,
  DomainEvents,
  OrderRepository,
  OrderStatus,
  OrderStatusChangedToStockConfirmedDomainEvent,
} from '../../../domain';
import { OutboxRepository } from '../../repositories/outbox.repository';
import { OrderStatusChangedToStockConfirmedEvent } from '../integration/order-status-changed-to-stock-confirmed.event';

export class OrderStatusChangedToStockConfirmedDomainEventHandler {
  constructor(
    private readonly _orderRepository: OrderRepository,
    private readonly _buyerRepository: BuyerRepository,
    private readonly _outboxRepository: OutboxRepository,
    private readonly _logger: ILogger
  ) {
    DomainEvents.register(
      this._onOrderStatusChangedToStockConfirmed.bind(this),
      OrderStatusChangedToStockConfirmedDomainEvent.name
    );
  }

  private async _onOrderStatusChangedToStockConfirmed(
    event: OrderStatusChangedToStockConfirmedDomainEvent
  ): Promise<void> {
    this._logger.debug(
      `Order with id: ${event.orderId} has been successfully updated to status ${OrderStatus.STOCK_CONFIRMED}`
    );

    const order = await this._orderRepository.getOrder(event.orderId);
    const buyer = await this._buyerRepository.findById(order.buyerId);

    const orderStatusChangedToStockConfirmedEvent =
      new OrderStatusChangedToStockConfirmedEvent(
        order.id,
        OrderStatus[order.orderStatusId],
        buyer.name
      );

    await this._outboxRepository.create({
      id: orderStatusChangedToStockConfirmedEvent.id,
      payload: JSON.stringify(orderStatusChangedToStockConfirmedEvent),
    });
  }
}
