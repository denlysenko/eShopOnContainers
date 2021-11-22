import { ApiProperty } from '@nestjs/swagger';
import { CatalogBrandReadDto } from './catalog-brand-read.dto';
import { CatalogTypeReadDto } from './catalog-type-read.dto';

export class CatalogItemReadDto {
  @ApiProperty()
  public readonly id: number;

  @ApiProperty()
  public readonly name: string;

  @ApiProperty()
  public readonly description: string;

  @ApiProperty()
  public readonly price: number;

  @ApiProperty()
  public readonly pictureFileName: string;

  @ApiProperty()
  public readonly pictureUri: string;

  @ApiProperty({
    type: CatalogTypeReadDto,
  })
  public readonly catalogType: CatalogTypeReadDto;

  @ApiProperty({
    type: CatalogBrandReadDto,
  })
  public readonly catalogBrand: CatalogBrandReadDto;

  @ApiProperty()
  public readonly availableStock: number;

  @ApiProperty()
  public readonly restockThreshold: number;

  @ApiProperty()
  public readonly maxStockThreshold: number;

  @ApiProperty()
  public readonly onReorder: boolean;
}
