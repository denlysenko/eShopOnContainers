import {
  EventBusClient,
  EVENT_BUS_CLIENT,
  IntegrationEvent,
} from '@e-shop-on-containers/event-bus';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageStatus } from '../constants';
import { OutboxEntity } from '../database/entities/outbox.entity';

@Injectable()
export class OutboxService {
  private readonly _logger = new Logger(OutboxService.name);

  constructor(
    @Inject(EVENT_BUS_CLIENT) private readonly _eventBusClient: EventBusClient,
    @InjectRepository(OutboxEntity)
    private readonly _outboxRepository: Repository<OutboxEntity>
  ) {}

  async publishThroughEventBus(event: IntegrationEvent) {
    try {
      await this._eventBusClient.publish(event);
      await this._outboxRepository.update(event.id, {
        status: MessageStatus.SENT,
        updatedAt: new Date(),
      });
      this._logger.debug(
        `Message with id ${event.id} status changed to '${MessageStatus.SENT}'`
      );
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
