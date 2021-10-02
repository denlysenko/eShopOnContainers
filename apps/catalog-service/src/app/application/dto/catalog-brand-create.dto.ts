import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CatalogBrandCreateDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'brand is required' })
  @MaxLength(100, { message: 'brand must have maximum length of 100 symbols' })
  public readonly brand: string;
}
