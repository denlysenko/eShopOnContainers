import { IntegrationEvent } from '@e-shop-on-containers/event-bus';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MessageStatus } from '../constants';
import { OutboxEntity } from '../database/entities/outbox.entity';
import { OutboxService } from './outbox.service';

@Injectable()
export class OutboxScheduler {
  private readonly _logger = new Logger(OutboxScheduler.name);

  constructor(
    @InjectRepository(OutboxEntity)
    private readonly _outboxRepository: Repository<OutboxEntity>,
    private readonly _outboxService: OutboxService
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    this._logger.debug(
      `Fetching messages from outbox with status '${MessageStatus.PENDING}' and '${MessageStatus.FAILED}'`
    );

    const messages = await this._outboxRepository.find({
      where: {
        status: In([MessageStatus.PENDING, MessageStatus.FAILED]),
      },
    });

    this._logger.debug(`Found ${messages.length} unpublished messages`);

    if (messages.length) {
      for (const message of messages) {
        const payload: IntegrationEvent = JSON.parse(message.payload);
        await this._outboxService.publishThroughEventBus(payload);
      }
    }
  }
}
