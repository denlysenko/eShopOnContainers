import { plainToClass } from 'class-transformer';
import { CatalogItem } from '../../models';
import { CatalogItemCreateDto } from '../dto/catalog-item-create.dto';
import { CatalogItemReadDto } from '../dto/catalog-item-read.dto';
import { CatalogItemsReadDto } from '../dto/catalog-items-read.dto';

interface CatalogItems {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: CatalogItem[];
}

export class CatalogItemMapper {
  static toReadItemDto(catalogItem: CatalogItem): CatalogItemReadDto {
    return plainToClass(CatalogItemReadDto, catalogItem, {
      excludeExtraneousValues: true,
    });
  }

  static toReadItemsDto(catalogItems: CatalogItems): CatalogItemsReadDto {
    return plainToClass(
      CatalogItemsReadDto,
      {
        ...catalogItems,
        data: catalogItems.data.map((item) =>
          CatalogItemMapper.toReadItemDto(item)
        ),
      },
      {
        excludeExtraneousValues: true,
      }
    );
  }

  static toModel(catalogItemDto: CatalogItemCreateDto): CatalogItem {
    return plainToClass(CatalogItem, catalogItemDto, {
      excludeExtraneousValues: true,
    });
  }
}
