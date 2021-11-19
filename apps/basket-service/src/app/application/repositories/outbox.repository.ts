import { Message } from '../models/message.model';

export interface OutboxRepository {
  create(message: Message): Promise<void>;
  update(id: string, message: Partial<Message>): Promise<void>;
  delete(id: string): Promise<void>;
}

export const OUTBOX_REPOSITORY = Symbol('OutboxRepository');
