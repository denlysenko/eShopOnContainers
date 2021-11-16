import { ILogger } from '@e-shop-on-containers/logger';
import {
  Buyer,
  BuyerRepository,
  DomainEvents,
  OrderStartedDomainEvent,
  OrderStatus,
} from '../../../domain';
import { OutboxRepository } from '../../repositories/outbox.repository';
import { OrderStatusChangedToSubmittedEvent } from '../integration/order-status-changed-to-submitted.event';

export class OrderStartedDomainEventHandler {
  constructor(
    private readonly _buyerRepository: BuyerRepository,
    private readonly _outboxRepository: OutboxRepository,
    private readonly _logger: ILogger
  ) {
    DomainEvents.register(
      this._onOrderStarted.bind(this),
      OrderStartedDomainEvent.name
    );
  }

  private async _onOrderStarted(event: OrderStartedDomainEvent): Promise<void> {
    const cardTypeId = event.cardTypeId !== 0 ? event.cardTypeId : 1;
    let buyer = await this._buyerRepository.findByIdentity(event.userId);
    const buyerOriginallyExisted = !!buyer;

    if (!buyerOriginallyExisted) {
      const id = await this._buyerRepository.nextBuyerId();

      buyer = Buyer.create({
        id,
        identityGuid: event.userId,
        name: event.userName,
      });
    }

    let paymentMethodId = event.order.paymentMethodId;

    if (!paymentMethodId) {
      paymentMethodId = await this._buyerRepository.nextPaymentMethodId();
    }

    buyer.verifyOrAddPaymentMethod(
      {
        id: paymentMethodId,
        cardTypeId,
        cardNumber: event.cardNumber,
        cardSecurityNumber: event.cardSecurityNumber,
        cardHolderName: event.cardHolderName,
        cardExpiration: event.cardExpiration,
        alias: '',
      },
      event.order.id
    );

    try {
      const updatedBuyer = await (buyerOriginallyExisted
        ? this._buyerRepository.updateBuyer(buyer)
        : this._buyerRepository.addBuyer(buyer));

      this._logger.debug(
        `Buyer ${updatedBuyer.identityGuid} and related payment method were validated or updated for orderId: ${event.order.id}.`
      );
    } catch (error) {
      this._logger.debug(
        `Buyer ${buyer.identityGuid} and related payment method were not validated or updated for orderId: ${event.order.id}. Error: ${error}`
      );

      return;
    }

    const orderStatusChangedToSubmittedEvent =
      new OrderStatusChangedToSubmittedEvent(
        event.order.id,
        OrderStatus[event.order.orderStatusId],
        buyer.name
      );

    await this._outboxRepository.create({
      id: orderStatusChangedToSubmittedEvent.id,
      payload: JSON.stringify(orderStatusChangedToSubmittedEvent),
    });
  }
}
