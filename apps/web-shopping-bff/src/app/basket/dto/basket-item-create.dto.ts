import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

export class BasketItemCreateDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'productId is required' })
  public readonly productId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'productName is required' })
  public readonly productName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'unitPrice is required' })
  public readonly unitPrice: number;

  @ApiProperty()
  public readonly oldUnitPrice: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'quantity is required' })
  @Min(1, { message: 'Invalid number of units' })
  public readonly quantity: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'pictureUrl is required' })
  public readonly pictureUrl: string;
}
