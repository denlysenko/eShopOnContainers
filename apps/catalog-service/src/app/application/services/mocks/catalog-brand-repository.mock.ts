import { CatalogBrandRepository } from '../../repositories/catalog-brand.repository';

export const catalogBrandRepositoryMock: CatalogBrandRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};
