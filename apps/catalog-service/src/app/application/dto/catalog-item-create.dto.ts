import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CatalogItemCreateDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'name is required' })
  @MaxLength(50, { message: 'name must have maximum length of 50 symbols' })
  public readonly name: string;

  @ApiProperty()
  public readonly description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'price is required' })
  public readonly price: number;

  @ApiProperty()
  public readonly pictureFileName: string;

  @ApiProperty()
  public readonly pictureUri: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'catalogTypeId is required' })
  public readonly catalogTypeId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'catalogTypeId is required' })
  public readonly catalogBrandId: number;

  @ApiProperty()
  public readonly availableStock: number;

  @ApiProperty()
  public readonly restockThreshold: number;

  @ApiProperty()
  public readonly maxStockThreshold: number;

  @ApiProperty()
  public readonly onReorder: boolean;
}
