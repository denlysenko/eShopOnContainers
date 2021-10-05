import { CatalogTypeRepository } from '../../repositories/catalog-type.repository';

export const catalogTypeRepositoryMock: CatalogTypeRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
};
