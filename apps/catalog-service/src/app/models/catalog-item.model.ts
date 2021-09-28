import { Expose, Type } from 'class-transformer';
import { CatalogBrand } from './catalog-brand.model';
import { CatalogType } from './catalog-type.model';

export class CatalogItem {
  @Expose()
  public id: number;

  @Expose()
  public name: string;

  @Expose()
  public description: string;

  @Expose()
  public price: number;

  @Expose()
  public pictureFileName: string;

  @Expose()
  public pictureUri: string;

  @Expose()
  public catalogTypeId: number;

  @Expose()
  @Type(() => CatalogType)
  public catalogType: CatalogType;

  @Expose()
  public catalogBrandId: number;

  @Expose()
  @Type(() => CatalogBrand)
  public catalogBrand: CatalogBrand;
  // Quantity in stock
  @Expose()
  public availableStock: number;
  // Available stock at which we should reorder
  @Expose()
  public restockThreshold: number;
  // Maximum number of units that can be in-stock at any time (due to physical/logistical constraints in warehouses)
  @Expose()
  public maxStockThreshold: number;
  // True if item is on reorder
  @Expose()
  public onReorder: boolean;
}
