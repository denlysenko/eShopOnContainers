import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CATALOG_BRAND_REPOSITORY,
  CATALOG_ITEM_REPOSITORY,
  CATALOG_TYPE_REPOSITORY,
  OUTBOX_REPOSITORY,
} from '../../application';
import { CatalogBrandEntity } from './entities/catalog-brand.entity';
import { CatalogItemEntity } from './entities/catalog-item.entity';
import { CatalogTypeEntity } from './entities/catalog-type.entity';
import { OutboxEntity } from './entities/outbox.entity';
import { TypeOrmCatalogBrandRepository } from './repositories/typeorm-catalog-brand.repository';
import { TypeOrmCatalogItemRepository } from './repositories/typeorm-catalog-item.repository';
import { TypeOrmCatalogTypeRepository } from './repositories/typeorm-catalog-type.repository';
import { TypeOrmOutboxRepository } from './repositories/typeorm-outbox.repository';
import { TypeOrmUnitOfWork } from './typeorm-unit-of-work';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers: Provider<any>[] = [
  TypeOrmUnitOfWork,
  {
    provide: CATALOG_BRAND_REPOSITORY,
    useClass: TypeOrmCatalogBrandRepository,
  },
  {
    provide: CATALOG_TYPE_REPOSITORY,
    useClass: TypeOrmCatalogTypeRepository,
  },
  {
    provide: CATALOG_ITEM_REPOSITORY,
    useClass: TypeOrmCatalogItemRepository,
  },
  {
    provide: OUTBOX_REPOSITORY,
    useClass: TypeOrmOutboxRepository,
  },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CatalogBrandEntity,
      CatalogItemEntity,
      CatalogTypeEntity,
      OutboxEntity,
    ]),
  ],
  providers,
  exports: [TypeOrmModule, ...providers],
})
export class DatabaseModule {}
