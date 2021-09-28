import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogBrandEntity } from './entities/catalog-brand.entity';
import { CatalogItemEntity } from './entities/catalog-item.entity';
import { CatalogTypeEntity } from './entities/catalog-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CatalogBrandEntity,
      CatalogItemEntity,
      CatalogTypeEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
