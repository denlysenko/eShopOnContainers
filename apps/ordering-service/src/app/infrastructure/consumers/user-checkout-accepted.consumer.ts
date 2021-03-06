import { ILogger, LOGGER } from '@e-shop-on-containers/logger';
import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller, Inject } from '@nestjs/common';
import { validate } from 'class-validator';
import {
  CreateOrderCommand,
  InboxRepository,
  INBOX_REPOSITORY,
  Mediator,
  UserCheckoutAcceptedEvent,
} from '../../application';

@Controller()
export class UserCheckoutAcceptedConsumer {
  constructor(
    private readonly _mediator: Mediator,
    @Inject(INBOX_REPOSITORY)
    private readonly _inboxRepository: InboxRepository,
    @Inject(LOGGER) private readonly _logger: ILogger
  ) {}

  @RabbitSubscribe({
    exchange: process.env.EXCHANGE,
    routingKey: UserCheckoutAcceptedEvent.name,
  })
  async handle(event: UserCheckoutAcceptedEvent): Promise<void | Nack> {
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

    const command = new CreateOrderCommand(
      event.basket.basketItems,
      event.userId,
      event.userName,
      event.city,
      event.street,
      event.state,
      event.country,
      event.zipCode,
      event.cardNumber,
      event.cardHolderName,
      event.cardExpiration,
      event.cardSecurityNumber,
      event.cardTypeId
    );

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
      `-- Sending command: ${CreateOrderCommand.name} - (${JSON.stringify(
        command
      )})`
    );

    try {
      const [result] = await Promise.all([
        this._mediator.send(command),
        this._inboxRepository.create(event.id),
      ]);

      if (result.success) {
        this._logger.debug('-- CreateOrderCommand succeeded');
      } else {
        this._logger.debug('-- CreateOrderCommand failed');
      }
    } catch (error) {
      this._logger.error(
        `-- Command: ${CreateOrderCommand.name} - (${JSON.stringify(
          command
        )}) was failed. Error: ${error}`
      );

      return new Nack(true);
    }
  }
}
