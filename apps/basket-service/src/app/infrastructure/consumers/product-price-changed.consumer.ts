import { ILogger, LOGGER } from '@e-shop-on-containers/logger';
import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import {
  BasketRepository,
  BASKET_REPOSITORY,
  InboxRepository,
  INBOX_REPOSITORY,
  ProductPriceChangedEvent,
} from '../../application';

@Injectable()
export class ProductPriceChangedConsumer {
  constructor(
    @Inject(INBOX_REPOSITORY)
    private readonly _inboxRepository: InboxRepository,
    @Inject(LOGGER) private readonly _logger: ILogger,
    @Inject(BASKET_REPOSITORY)
    private readonly _basketRepository: BasketRepository
  ) {}

  @RabbitSubscribe({
    exchange: process.env.EXCHANGE,
    routingKey: ProductPriceChangedEvent.name,
  })
  async handle(event: ProductPriceChangedEvent): Promise<void | Nack> {
    this._logger.debug(
      `-- Handling integration event: ${
        event.id
      } at BasketService - (${JSON.stringify(event)})`
    );

    const processed = await this._inboxRepository.exists(event.id);

    if (processed) {
      this._logger.debug(
        `-- Integration event: ${event.id} at BasketService - (${JSON.stringify(
          event
        )}) was already processed`
      );

      return;
    }

    try {
      await Promise.all([
        this._basketRepository.updateUnitPrice(
          event.productId,
          event.newPrice,
          event.oldPrice
        ),
        this._inboxRepository.create(event.id),
      ]);
    } catch (error) {
      this._logger.error(`-- Updating product price failed. Error: ${error}`);

      return new Nack(true);
    }
  }
}
