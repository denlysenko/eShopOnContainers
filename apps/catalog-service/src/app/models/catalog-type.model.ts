import { Expose } from 'class-transformer';

export class CatalogType {
  @Expose()
  public id: number;

  @Expose()
  public type: string;
}
