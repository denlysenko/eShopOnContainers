import { CatalogBrand } from '../../models';

export interface CatalogBrandRepository {
  findAll(): Promise<CatalogBrand[]>;
  findById(id: number): Promise<CatalogBrand>;
  update(
    id: number,
    catalogBrandCatalogBrand: Partial<CatalogBrand>
  ): Promise<CatalogBrand>;
  create(
    catalogBrandCatalogBrand: Omit<CatalogBrand, 'id'>
  ): Promise<CatalogBrand>;
  delete(id: number): Promise<void>;
}

export const CATALOG_BRAND_REPOSITORY = Symbol('CatalogBrandRepository');
