import { Expose } from 'class-transformer';

export class BasketItem {
  @Expose()
  public id: string;

  @Expose()
  public productId: number;

  @Expose()
  public productName: string;

  @Expose()
  public unitPrice: number;

  @Expose()
  public oldUnitPrice: number;

  @Expose()
  public quantity: number;

  @Expose()
  public pictureUrl: string;
}
