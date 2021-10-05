import { CatalogType } from '../../models';

export interface CatalogTypeRepository {
  findAll(): Promise<CatalogType[]>;
  findById(id: number): Promise<CatalogType>;
  update(id: number, catalogType: Partial<CatalogType>): Promise<CatalogType>;
  create(catalogType: Omit<CatalogType, 'id'>): Promise<CatalogType>;
}

export const CATALOG_TYPE_REPOSITORY = Symbol('CatalogTypeRepository');
