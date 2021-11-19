import { ILogger, LOGGER } from '@e-shop-on-containers/logger';
import { Controller, Inject } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  BasketRepository,
  BASKET_REPOSITORY,
  InboxRepository,
  INBOX_REPOSITORY,
  ProductPriceChangedEvent,
} from '../../application';

@Controller()
export class ProductPriceChangedConsumer {
  constructor(
    @Inject(INBOX_REPOSITORY)
    private readonly _inboxRepository: InboxRepository,
    @Inject(LOGGER) private readonly _logger: ILogger,
    @Inject(BASKET_REPOSITORY)
    private readonly _basketRepository: BasketRepository
  ) {}

  @EventPattern(ProductPriceChangedEvent.name)
  async handle(
    @Payload() event: ProductPriceChangedEvent,
    @Ctx() context: RmqContext
  ): Promise<void> {
    this._logger.debug(
      `-- Handling integration event: ${
        event.id
      } at BasketService - (${JSON.stringify(event)})`
    );

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    const processed = await this._inboxRepository.exists(event.id);

    if (processed) {
      this._logger.debug(
        `-- Integration event: ${event.id} at BasketService - (${JSON.stringify(
          event
        )}) was already processed`
      );

      channel.ack(originalMsg);

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

      channel.ack(originalMsg);
    } catch (error) {
      this._logger.error(`-- Updating product price failed. Error: ${error}`);
    }
  }
}
