import { PartialType } from '@nestjs/swagger';
import { CatalogItemCreateDto } from './catalog-item-create.dto';

export class CatalogItemUpdateDto extends PartialType(CatalogItemCreateDto) {}
