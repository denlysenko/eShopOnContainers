import { PartialType } from '@nestjs/mapped-types';
import { CatalogItemCreateDto } from './catalog-item-create.dto';

export class CatalogItemUpdateDto extends PartialType(CatalogItemCreateDto) {}
