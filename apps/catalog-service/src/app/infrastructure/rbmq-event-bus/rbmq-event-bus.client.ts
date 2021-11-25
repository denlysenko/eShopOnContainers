import {
  EventBusClient,
  IntegrationEvent,
} from '@e-shop-on-containers/event-bus';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';

const exchange = process.env.EXCHANGE;

@Injectable()
export class RbmqEventBusClient implements EventBusClient {
  private readonly _logger = new Logger(RbmqEventBusClient.name);

  constructor(private readonly _amqpConnection: AmqpConnection) {}

  async publish(event: IntegrationEvent): Promise<void> {
    this._logger.debug(
      `Trying to send event: ${JSON.stringify(event)} to Event bus`
    );

    try {
      await this._amqpConnection.publish(exchange, event.name, event);

      this._logger.debug(
        `Event: ${JSON.stringify(event)} was successfully sent to Event bus`
      );
    } catch (error) {
      this._logger.error(
        `Event: ${JSON.stringify(event)} was not sent due to error: ${error}`
      );

      throw error;
    }
  }
}
