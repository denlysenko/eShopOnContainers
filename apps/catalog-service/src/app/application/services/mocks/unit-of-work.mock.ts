import { UnitOfWork } from '../../repositories/unit-of-work';

export const unitOfWorkMock: UnitOfWork = {
  withTransaction: jest.fn(),
};
