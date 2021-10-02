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
import { DbCatalogBrandRepository } from './repositories/db-catalog-brand.repository';
import { DbCatalogItemRepository } from './repositories/db-catalog-item.repository';
import { DbCatalogTypeRepository } from './repositories/db-catalog-type.repository';
import { DbOutboxRepository } from './repositories/db-outbox.repository';
import { TypeOrmUnitOfWork } from './typeorm-unit-of-work';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers: Provider<any>[] = [
  TypeOrmUnitOfWork,
  {
    provide: CATALOG_BRAND_REPOSITORY,
    useClass: DbCatalogBrandRepository,
  },
  {
    provide: CATALOG_TYPE_REPOSITORY,
    useClass: DbCatalogTypeRepository,
  },
  {
    provide: CATALOG_ITEM_REPOSITORY,
    useClass: DbCatalogItemRepository,
  },
  {
    provide: OUTBOX_REPOSITORY,
    useClass: DbOutboxRepository,
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
