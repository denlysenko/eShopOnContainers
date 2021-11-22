import { ApiProperty } from '@nestjs/swagger';

export class BasketItemReadDto {
  @ApiProperty()
  public readonly id: string;

  @ApiProperty()
  public readonly productId: number;

  @ApiProperty()
  public readonly productName: string;

  @ApiProperty()
  public readonly unitPrice: number;

  @ApiProperty()
  public readonly oldUnitPrice: number;

  @ApiProperty()
  public readonly quantity: number;

  @ApiProperty()
  public readonly pictureUrl: string;
}
