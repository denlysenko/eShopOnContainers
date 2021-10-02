import { plainToClass } from 'class-transformer';
import { CatalogBrand } from '../../models';
import { CatalogBrandCreateDto } from '../dto/catalog-brand-create.dto';
import { CatalogBrandReadDto } from '../dto/catalog-brand-read.dto';

export class CatalogBrandMapper {
  static toReadDto(catalogBrand: CatalogBrand): CatalogBrandReadDto {
    return plainToClass(CatalogBrandReadDto, catalogBrand, {
      excludeExtraneousValues: true,
    });
  }

  static toModel(catalogBrandDto: CatalogBrandCreateDto): CatalogBrand {
    return plainToClass(CatalogBrand, catalogBrandDto, {
      excludeExtraneousValues: true,
    });
  }
}
