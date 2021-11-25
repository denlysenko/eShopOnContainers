import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutboxRepository } from '../../../application';
import { Message } from '../../../models';
import { OutboxEntity } from '../entities/outbox.entity';

export class TypeOrmOutboxRepository implements OutboxRepository {
  constructor(
    @InjectRepository(OutboxEntity)
    private readonly _outboxRepository: Repository<OutboxEntity>
  ) {}

  async create(message: Message): Promise<void> {
    const createdMessage = this._outboxRepository.create(message);

    await this._outboxRepository.insert(createdMessage);
  }

  async update(id: string, message: Partial<Message>): Promise<void> {
    await this._outboxRepository.update(id, message);
  }

  async delete(id: string): Promise<void> {
    await this._outboxRepository.delete(id);
  }
}
