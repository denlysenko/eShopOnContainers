import {
  EventBusClient,
  IntegrationEvent,
} from '@e-shop-on-containers/event-bus';
import { LoggerService } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MessageStatus } from '../constants';
import { OutboxEntity } from '../database/entities/outbox.entity';

export class OutboxService {
  constructor(
    private readonly _eventBusClient: EventBusClient,
    private readonly _outboxRepository: Repository<OutboxEntity>,
    private readonly _logger: LoggerService
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
