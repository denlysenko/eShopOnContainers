import { UnitOfWork } from '../unit-of-work';

export const unitOfWorkMock: UnitOfWork = {
  withTransaction: jest.fn(),
};
