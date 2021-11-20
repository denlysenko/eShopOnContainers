import { UnitOfWork } from '../../services/unit-of-work';

export const unitOfWorkMock: UnitOfWork = {
  withTransaction: jest.fn(),
};
