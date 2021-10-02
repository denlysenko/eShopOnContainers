import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CatalogItemReadDto } from './catalog-item-read.dto';

export class CatalogItemsReadDto {
  @ApiProperty()
  @Expose()
  pageIndex: number;

  @ApiProperty()
  @Expose()
  pageSize: number;

  @ApiProperty()
  @Expose()
  count: number;

  @ApiProperty({
    type: CatalogItemReadDto,
    isArray: true,
  })
  @Expose()
  @Type(() => CatalogItemReadDto)
  data: CatalogItemReadDto[];
}
