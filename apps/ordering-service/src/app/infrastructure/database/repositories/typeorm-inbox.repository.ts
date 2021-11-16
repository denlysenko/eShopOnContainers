import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InboxRepository } from '../../../application';
import { InboxEntity } from '../entities/inbox.entity';

export class TypeOrmInboxRepository implements InboxRepository {
  constructor(
    @InjectRepository(InboxEntity)
    private readonly _inboxRepository: Repository<InboxEntity>
  ) {}

  async create(messageId: string): Promise<void> {
    const createdMessage = this._inboxRepository.create({ id: messageId });

    await this._inboxRepository.insert(createdMessage);
  }

  async exists(messageId: string): Promise<boolean> {
    const message = await this._inboxRepository.findOne(messageId);

    return !!message;
  }

  async delete(messageId: string): Promise<void> {
    await this._inboxRepository.delete({ id: messageId });
  }
}
