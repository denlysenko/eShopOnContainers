import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BasketItemReadDto {
  @ApiProperty()
  @Expose()
  public readonly id: string;

  @ApiProperty()
  @Expose()
  public readonly productId: number;

  @ApiProperty()
  @Expose()
  public readonly productName: string;

  @ApiProperty()
  @Expose()
  public readonly unitPrice: number;

  @ApiProperty()
  @Expose()
  public readonly oldUnitPrice: number;

  @ApiProperty()
  @Expose()
  public readonly quantity: number;

  @ApiProperty()
  @Expose()
  public readonly pictureUrl: string;
}
