import { ILogger } from '@e-shop-on-containers/logger';
import {
  BuyerRepository,
  DomainEvents,
  OrderCancelledDomainEvent,
  OrderStatus,
} from '../../../domain';
import { OutboxRepository } from '../../repositories/outbox.repository';
import { OrderStatusChangedToCancelledEvent } from '../integration/order-status-changed-to-cancelled.event';

export class OrderCancelledDomainEventHandler {
  constructor(
    private readonly _buyerRepository: BuyerRepository,
    private readonly _outboxRepository: OutboxRepository,
    private readonly _logger: ILogger
  ) {
    DomainEvents.register(
      this._onOrderCancelled.bind(this),
      OrderCancelledDomainEvent.name
    );
  }

  private async _onOrderCancelled(
    event: OrderCancelledDomainEvent
  ): Promise<void> {
    this._logger.debug(
      `Order with id: ${
        event.order.id
      } has been successfully updated to status ${
        OrderStatus[OrderStatus.CANCELLED]
      }`
    );

    const buyer = await this._buyerRepository.findById(event.order.buyerId);

    const orderStatusChangedToCancelledEvent =
      new OrderStatusChangedToCancelledEvent(
        event.order.id,
        OrderStatus[OrderStatus.CANCELLED],
        buyer.name
      );

    await this._outboxRepository.create({
      id: orderStatusChangedToCancelledEvent.id,
      payload: JSON.stringify(orderStatusChangedToCancelledEvent),
    });
  }
}
