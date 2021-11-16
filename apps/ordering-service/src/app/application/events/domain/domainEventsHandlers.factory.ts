import { ILogger } from '@e-shop-on-containers/logger';
import { BuyerRepository, OrderRepository } from '../../../domain';
import { OutboxRepository } from '../../repositories/outbox.repository';
import { BuyerAndPaymentMethodVerifiedDomainEventHandler } from './BuyerAndPaymentMethodVerifiedDomainEventHandler';
import { OrderCancelledDomainEventHandler } from './OrderCancelledDomainEventHandler';
import { OrderShippedDomainEventHandler } from './OrderShippedDomainEventHandler';
import { OrderStartedDomainEventHandler } from './OrderStartedDomainEventHandler';
import { OrderStatusChangedToAwaitingValidationDomainEventHandler } from './OrderStatusChangedToAwaitingValidationDomainEventHandler';
import { OrderStatusChangedToPaidDomainEventHandler } from './OrderStatusChangedToPaidDomainEventHandler';
import { OrderStatusChangedToStockConfirmedDomainEventHandler } from './OrderStatusChangedToStockConfirmedDomainEventHandler';

export function createDomainEventsHandlers(
  orderRepository: OrderRepository,
  buyerRepository: BuyerRepository,
  outboxRepository: OutboxRepository,
  logger: ILogger
): void {
  new BuyerAndPaymentMethodVerifiedDomainEventHandler(orderRepository, logger);
  new OrderCancelledDomainEventHandler(
    buyerRepository,
    outboxRepository,
    logger
  );
  new OrderShippedDomainEventHandler(buyerRepository, outboxRepository, logger);
  new OrderStartedDomainEventHandler(buyerRepository, outboxRepository, logger);
  new OrderStatusChangedToAwaitingValidationDomainEventHandler(
    orderRepository,
    buyerRepository,
    outboxRepository,
    logger
  );
  new OrderStatusChangedToPaidDomainEventHandler(
    orderRepository,
    buyerRepository,
    outboxRepository,
    logger
  );
  new OrderStatusChangedToStockConfirmedDomainEventHandler(
    orderRepository,
    buyerRepository,
    outboxRepository,
    logger
  );
}
