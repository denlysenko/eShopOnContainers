import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CatalogBrandReadDto } from './catalog-brand-read.dto';
import { CatalogTypeReadDto } from './catalog-type-read.dto';

export class CatalogItemReadDto {
  @ApiProperty()
  @Expose()
  public readonly id: number;

  @ApiProperty()
  @Expose()
  public readonly name: string;

  @ApiProperty()
  @Expose()
  public readonly description: string;

  @ApiProperty()
  @Expose()
  public readonly price: number;

  @ApiProperty()
  @Expose()
  public readonly pictureFileName: string;

  @ApiProperty()
  @Expose()
  public readonly pictureUri: string;

  @ApiProperty({
    type: CatalogTypeReadDto,
  })
  @Expose()
  @Type(() => CatalogTypeReadDto)
  public readonly catalogType: CatalogTypeReadDto;

  @ApiProperty({
    type: CatalogBrandReadDto,
  })
  @Expose()
  @Type(() => CatalogBrandReadDto)
  public readonly catalogBrand: CatalogBrandReadDto;

  @ApiProperty()
  @Expose()
  public readonly availableStock: number;

  @ApiProperty()
  @Expose()
  public readonly restockThreshold: number;

  @ApiProperty()
  @Expose()
  public readonly maxStockThreshold: number;

  @ApiProperty()
  @Expose()
  public readonly onReorder: boolean;
}
