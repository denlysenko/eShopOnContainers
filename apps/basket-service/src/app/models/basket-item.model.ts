import { Expose } from 'class-transformer';

export class BasketItem {
  @Expose()
  public readonly id: string;

  @Expose()
  public readonly productId: number;

  @Expose()
  public readonly productName: string;

  @Expose()
  public readonly unitPrice: number;

  @Expose()
  public readonly oldUnitPrice: number;

  @Expose()
  public readonly quantity: number;

  @Expose()
  public readonly pictureUrl: string;
}
