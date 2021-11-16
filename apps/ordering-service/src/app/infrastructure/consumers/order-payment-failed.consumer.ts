import { ILogger, LOGGER } from '@e-shop-on-containers/logger';
import { Controller, Inject } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { validate } from 'class-validator';
import {
  CancelOrderCommand,
  InboxRepository,
  INBOX_REPOSITORY,
  Mediator,
  OrderPaymentFailedEvent,
} from '../../application';

@Controller()
export class OrderPaymentFailedConsumer {
  constructor(
    private readonly _mediator: Mediator,
    @Inject(INBOX_REPOSITORY)
    private readonly _inboxRepository: InboxRepository,
    @Inject(LOGGER) private readonly _logger: ILogger
  ) {}

  @EventPattern(OrderPaymentFailedEvent.name)
  async handle(
    @Payload() event: OrderPaymentFailedEvent,
    @Ctx() context: RmqContext
  ): Promise<void> {
    this._logger.debug(
      `-- Handling integration event: ${
        event.id
      } at OrderingService - (${JSON.stringify(event)})`
    );

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    const processed = await this._inboxRepository.exists(event.id);

    if (processed) {
      this._logger.debug(
        `-- Integration event: ${
          event.id
        } at OrderingService - (${JSON.stringify(event)}) was already processed`
      );

      channel.ack(originalMsg);

      return;
    }

    const command = new CancelOrderCommand(event.orderId);

    const errors = await validate(command);

    if (errors.length > 0) {
      this._logger.error(
        `Cannot handle integration event: ${
          event.id
        } at OrderingService - (${JSON.stringify(errors)})`
      );

      return;
    }

    this._logger.debug(
      `-- Sending command: ${CancelOrderCommand.name} - (${JSON.stringify(
        command
      )})`
    );

    try {
      await Promise.all([
        this._mediator.send(command),
        this._inboxRepository.create(event.id),
      ]);

      channel.ack(originalMsg);
    } catch (error) {
      this._logger.error(
        `-- Command: ${CancelOrderCommand.name} - (${JSON.stringify(
          command
        )}) was failed. Error: ${error}`
      );
    }
  }
}
