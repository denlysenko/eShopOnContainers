import { ILogger } from '@e-shop-on-containers/logger';
import {
  BuyerAndPaymentMethodVerifiedDomainEvent,
  DomainEvents,
  OrderRepository,
} from '../../../domain';

export class BuyerAndPaymentMethodVerifiedDomainEventHandler {
  constructor(
    private readonly _orderRepository: OrderRepository,
    private readonly _logger: ILogger
  ) {
    DomainEvents.register(
      this._onBuyerAndPaymentVerified.bind(this),
      BuyerAndPaymentMethodVerifiedDomainEvent.name
    );
  }

  private async _onBuyerAndPaymentVerified(
    event: BuyerAndPaymentMethodVerifiedDomainEvent
  ): Promise<void> {
    const orderToUpdate = await this._orderRepository.getOrder(event.orderId);

    orderToUpdate.setBuyerId(event.buyer.id);
    orderToUpdate.setPaymentId(event.payment.id);

    try {
      await this._orderRepository.updateOrder(orderToUpdate);

      this._logger.debug(
        `Order with id: ${event.orderId} has been successfully updated with a payment method ${event.payment.id}`
      );
    } catch (error) {
      this._logger.debug(
        `Order with id: ${event.orderId} has not been updated with a payment method ${event.payment.id}. Error: ${error}`
      );
    }
  }
}
