export interface InboxRepository {
  create(messageId: string): Promise<void>;
  exists(messageId: string): Promise<boolean>;
  delete(messageId: string): Promise<void>;
}

export const INBOX_REPOSITORY = Symbol('InboxRepository');
