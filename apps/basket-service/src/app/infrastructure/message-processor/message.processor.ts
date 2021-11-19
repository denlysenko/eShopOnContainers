import { IntegrationEvent } from '@e-shop-on-containers/event-bus';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { OutboxService } from '../../application';
import { MessageStatus } from '../../models';
import { OutboxEntity } from '../database/entities/outbox.entity';

@Injectable()
export class MessageProcessor {
  private readonly _logger = new Logger(MessageProcessor.name);

  constructor(
    @InjectRepository(OutboxEntity)
    private readonly _outboxRepository: Repository<OutboxEntity>,
    private readonly _outboxService: OutboxService
  ) {
    this._logger.debug('Starting Message Processor');
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async processMessages() {
    const messages = await this._outboxRepository.find({
      where: {
        status: In([MessageStatus.PENDING, MessageStatus.FAILED]),
      },
    });

    if (messages.length) {
      this._logger.debug(`Found ${messages.length} unpublished messages`);

      for (const message of messages) {
        const payload: IntegrationEvent = JSON.parse(message.payload);
        await this._outboxService.publishThroughEventBus(payload);
      }
    }
  }
}
