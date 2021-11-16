import { Expose } from 'class-transformer';

export class OrderItemDto {
  @Expose()
  public productId: number;

  @Expose()
  public productName: string;

  @Expose()
  public unitPrice: number;

  @Expose()
  public discount: number;

  @Expose({ name: 'quantity' })
  public units: number;

  @Expose()
  public pictureUrl: string;
}
