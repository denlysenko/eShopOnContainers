import {
  EventBusClient,
  IntegrationEvent,
} from '@e-shop-on-containers/event-bus';
import { ILogger } from '@e-shop-on-containers/logger';
import { MessageStatus } from '../../models';
import { OutboxRepository } from '../repositories/outbox.repository';

export class OutboxService {
  constructor(
    private readonly _eventBusClient: EventBusClient,
    private readonly _outboxRepository: OutboxRepository,
    private readonly _logger: ILogger
  ) {}

  async publishThroughEventBus(event: IntegrationEvent) {
    try {
      await this._eventBusClient.publish(event);
      this._logger.debug(
        `Deleting sent message from outbox with id ${event.id}`
      );
      await this._outboxRepository.delete(event.id);
    } catch {
      await this._outboxRepository.update(event.id, {
        status: MessageStatus.FAILED,
        updatedAt: new Date(),
      });
      this._logger.debug(
        `Message with id ${event.id} status changed to '${MessageStatus.FAILED}'`
      );
    }
  }
}
