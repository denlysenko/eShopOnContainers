import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BasketItemDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'id is required' })
  public id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'productId is required' })
  public productId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'productName is required' })
  public productName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'unitPrice is required' })
  public unitPrice: number;

  @ApiProperty()
  public oldUnitPrice: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'quantity is required' })
  public quantity: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'pictureUrl is required' })
  public pictureUrl: string;
}
