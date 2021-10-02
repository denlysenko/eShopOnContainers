import { CatalogItem } from '../../models';

export interface CatalogItemRepository {
  findAll(skip: number, take: number): Promise<[CatalogItem[], number]>;
  findById(id: number): Promise<CatalogItem>;
  findOne(id: number): Promise<CatalogItem>;
  findAllByName(
    name: string,
    skip: number,
    take: number
  ): Promise<[CatalogItem[], number]>;
  findAllByTypeAndBrand(
    catalogTypeId: number,
    catalogBrandId: number,
    skip: number,
    take: number
  ): Promise<[CatalogItem[], number]>;
  findAllByBrand(
    catalogBrandId: number,
    skip: number,
    take: number
  ): Promise<[CatalogItem[], number]>;
  update(id: number, catalogItem: Partial<CatalogItem>): Promise<void>;
  create(
    catalogItem: Omit<CatalogItem, 'id' | 'catalogBrand' | 'catalogType'>
  ): Promise<{ id: number }>;
  delete(id: number): Promise<void>;
}

export const CATALOG_ITEM_REPOSITORY = Symbol('CatalogItemRepository');
