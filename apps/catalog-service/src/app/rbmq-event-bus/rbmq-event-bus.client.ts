import {
  EventBusClient,
  IntegrationEvent,
} from '@e-shop-on-containers/event-bus';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RBMQ_MESSAGE_BUS_CLIENT } from '../constants';

export class RbmqEventBusClient implements EventBusClient {
  private readonly _logger = new Logger(RbmqEventBusClient.name);

  constructor(
    @Inject(RBMQ_MESSAGE_BUS_CLIENT)
    private readonly _client: ClientProxy
  ) {}

  publish(event: IntegrationEvent): Promise<void> {
    this._logger.debug(
      `Trying to send event: ${JSON.stringify(event)} to Event bus`
    );

    return new Promise((resolve, reject) => {
      this._client.emit(event.name, event).subscribe({
        next: () => {
          this._logger.debug(
            `Event: ${JSON.stringify(event)} was successfully sent to Event bus`
          );
          resolve();
        },
        error: (error) => {
          this._logger.error(
            `Event: ${JSON.stringify(
              event
            )} was not sent due to error: ${error}`
          );
          reject();
        },
      });
    });
  }
}
