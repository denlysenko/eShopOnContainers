import { plainToClass } from 'class-transformer';
import { CatalogTypeCreateDto } from '../dto/catalog-type-create.dto';
import { CatalogTypeReadDto } from '../dto/catalog-type-read.dto';
import { CatalogType } from '../models/catalog-type.model';

export class CatalogTypeMapper {
  static toReadDto(catalogType: CatalogType): CatalogTypeReadDto {
    return plainToClass(CatalogTypeReadDto, catalogType, {
      excludeExtraneousValues: true,
    });
  }

  static toModel(catalogTypeDto: CatalogTypeCreateDto): CatalogType {
    return plainToClass(CatalogType, catalogTypeDto, {
      excludeExtraneousValues: true,
    });
  }
}
