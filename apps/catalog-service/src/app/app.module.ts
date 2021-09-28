import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CatalogBrandEntity } from './database/entities/catalog-brand.entity';
import { CatalogItemEntity } from './database/entities/catalog-item.entity';
import { CatalogTypeEntity } from './database/entities/catalog-type.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.PG_CONNECTION_STRING,
      synchronize: false,
      autoLoadEntities: true,
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useFactory: (
        catalogItemRepository: Repository<CatalogItemEntity>,
        catalogTypeRepository: Repository<CatalogTypeEntity>,
        catalogBrandRepository: Repository<CatalogBrandEntity>
      ) =>
        new AppService(
          catalogItemRepository,
          catalogTypeRepository,
          catalogBrandRepository
        ),
      inject: [
        getRepositoryToken(CatalogItemEntity),
        getRepositoryToken(CatalogTypeEntity),
        getRepositoryToken(CatalogBrandEntity),
      ],
    },
  ],
})
export class AppModule {}
