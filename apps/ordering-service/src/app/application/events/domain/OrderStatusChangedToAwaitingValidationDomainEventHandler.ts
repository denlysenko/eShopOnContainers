import { ILogger } from '@e-shop-on-containers/logger';
import {
  BuyerRepository,
  DomainEvents,
  OrderRepository,
  OrderStatus,
  OrderStatusChangedToAwaitingValidationDomainEvent,
} from '../../../domain';
import { OutboxRepository } from '../../repositories/outbox.repository';
import {
  OrderStatusChangedToAwaitingValidationEvent,
  OrderStockItem,
} from '../integration/order-status-changed-to-awaiting-validation.event';

export class OrderStatusChangedToAwaitingValidationDomainEventHandler {
  constructor(
    private readonly _orderRepository: OrderRepository,
    private readonly _buyerRepository: BuyerRepository,
    private readonly _outboxRepository: OutboxRepository,
    private readonly _logger: ILogger
  ) {
    DomainEvents.register(
      this._onOrderStatusChangedToAwaitingValidation.bind(this),
      OrderStatusChangedToAwaitingValidationDomainEvent.name
    );
  }

  private async _onOrderStatusChangedToAwaitingValidation(
    event: OrderStatusChangedToAwaitingValidationDomainEvent
  ): Promise<void> {
    this._logger.debug(
      `Order with id: ${event.orderId} has been successfully updated to status ${OrderStatus.AWAITING_VALIDATION}`
    );

    const order = await this._orderRepository.getOrder(event.orderId);
    const buyer = await this._buyerRepository.findById(order.buyerId);

    const orderStockItems = event.orderItems.map(
      (item) => new OrderStockItem(item.productId, item.units)
    );

    const orderStatusChangedToAwaitingValidationEvent =
      new OrderStatusChangedToAwaitingValidationEvent(
        order.id,
        OrderStatus[order.orderStatusId],
        buyer.name,
        orderStockItems
      );

    await this._outboxRepository.create({
      id: orderStatusChangedToAwaitingValidationEvent.id,
      payload: JSON.stringify(orderStatusChangedToAwaitingValidationEvent),
    });
  }
}
