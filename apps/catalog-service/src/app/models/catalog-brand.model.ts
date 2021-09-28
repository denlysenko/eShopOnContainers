import { Expose } from 'class-transformer';

export class CatalogBrand {
  @Expose()
  public id: number;

  @Expose()
  public brand: string;
}
