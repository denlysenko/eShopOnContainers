import { ILogger, LOGGER } from '@e-shop-on-containers/logger';
import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import {
  InboxRepository,
  INBOX_REPOSITORY,
  Mediator,
  OrderStockConfirmedEvent,
  SetStockConfirmedStatusCommand,
} from '../../application';

@Injectable()
export class OrderStockConfirmedConsumer {
  constructor(
    private readonly _mediator: Mediator,
    @Inject(INBOX_REPOSITORY)
    private readonly _inboxRepository: InboxRepository,
    @Inject(LOGGER) private readonly _logger: ILogger
  ) {}

  @RabbitSubscribe({
    exchange: process.env.EXCHANGE,
    routingKey: OrderStockConfirmedEvent.name,
  })
  async handle(event: OrderStockConfirmedEvent): Promise<void | Nack> {
    this._logger.debug(
      `-- Handling integration event: ${
        event.id
      } at OrderingService - (${JSON.stringify(event)})`
    );

    const processed = await this._inboxRepository.exists(event.id);

    if (processed) {
      this._logger.debug(
        `-- Integration event: ${
          event.id
        } at OrderingService - (${JSON.stringify(event)}) was already processed`
      );

      return;
    }

    const command = new SetStockConfirmedStatusCommand(event.orderId);

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
      `-- Sending command: ${
        SetStockConfirmedStatusCommand.name
      } - (${JSON.stringify(command)})`
    );

    try {
      await Promise.all([
        this._mediator.send(command),
        this._inboxRepository.create(event.id),
      ]);
    } catch (error) {
      this._logger.error(
        `-- Command: ${SetStockConfirmedStatusCommand.name} - (${JSON.stringify(
          command
        )}) was failed. Error: ${error}`
      );

      return new Nack(true);
    }
  }
}
