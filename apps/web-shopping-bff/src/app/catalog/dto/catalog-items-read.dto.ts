import { ApiProperty } from '@nestjs/swagger';
import { CatalogItemReadDto } from './catalog-item-read.dto';

export class CatalogItemsReadDto {
  @ApiProperty()
  pageIndex: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  count: number;

  @ApiProperty({
    type: CatalogItemReadDto,
    isArray: true,
  })
  data: CatalogItemReadDto[];
}
