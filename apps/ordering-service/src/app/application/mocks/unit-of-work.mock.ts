import { UnitOfWork } from '../../domain';

export const unitOfWorkMock: UnitOfWork = {
  withTransaction: jest.fn(),
};
