import { OutboxRepository } from '../repositories/outbox.repository';

export const outboxRepositoryMock: OutboxRepository = {
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
