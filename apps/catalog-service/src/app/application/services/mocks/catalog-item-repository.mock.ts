import { CatalogItemRepository } from '../../repositories/catalog-item.repository';

export const catalogItemRepositoryMock: CatalogItemRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  findAllByName: jest.fn(),
  findAllByTypeAndBrand: jest.fn(),
  findAllByBrand: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};
