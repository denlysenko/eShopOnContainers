import { ILogger } from '@e-shop-on-containers/logger';
import {
  BuyerRepository,
  DomainEvents,
  OrderShippedDomainEvent,
  OrderStatus,
} from '../../../domain';
import { OutboxRepository } from '../../repositories/outbox.repository';
import { OrderStatusChangedToShippedEvent } from '../integration/order-status-changed-to-shipped.event';

export class OrderShippedDomainEventHandler {
  constructor(
    private readonly _buyerRepository: BuyerRepository,
    private readonly _outboxRepository: OutboxRepository,
    private readonly _logger: ILogger
  ) {
    DomainEvents.register(
      this._onOrderShipped.bind(this),
      OrderShippedDomainEvent.name
    );
  }

  private async _onOrderShipped(event: OrderShippedDomainEvent): Promise<void> {
    this._logger.debug(
      `Order with id: ${
        event.order.id
      } has been successfully updated to status ${
        OrderStatus[OrderStatus.SHIPPED]
      }`
    );

    const buyer = await this._buyerRepository.findById(event.order.buyerId);

    const orderStatusChangedToShippedEvent =
      new OrderStatusChangedToShippedEvent(
        event.order.id,
        OrderStatus[OrderStatus.SHIPPED],
        buyer.name
      );

    await this._outboxRepository.create({
      id: orderStatusChangedToShippedEvent.id,
      payload: JSON.stringify(orderStatusChangedToShippedEvent),
    });
  }
}
