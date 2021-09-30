import { EVENT_BUS_CLIENT } from '@e-shop-on-containers/event-bus';
import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RBMQ_MESSAGE_BUS_CLIENT } from './constants';
import { DatabaseModule } from './database/database.module';
import { CatalogBrandEntity } from './database/entities/catalog-brand.entity';
import { CatalogItemEntity } from './database/entities/catalog-item.entity';
import { CatalogTypeEntity } from './database/entities/catalog-type.entity';
import { OutboxEntity } from './database/entities/outbox.entity';
import { OutboxScheduler } from './outbox/outbox.scheduler';
import { OutboxService } from './outbox/outbox.service';
import { RbmqEventBusClient } from './rbmq-event-bus/rbmq-event-bus.client';

const queue = process.env.EVENT_QUEUE_NAME;
const eventBusConnection =
  process.env.EVENT_BUS_CONNECTION || 'amqp://localhost:5672';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.PG_CONNECTION_STRING,
      synchronize: false,
      autoLoadEntities: true,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    OutboxScheduler,
    OutboxService,
    {
      provide: EVENT_BUS_CLIENT,
      useClass: RbmqEventBusClient,
    },
    {
      provide: RBMQ_MESSAGE_BUS_CLIENT,
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [eventBusConnection],
            queue,
            queueOptions: {
              durable: false,
            },
          },
        }),
    },
    {
      provide: AppService,
      useFactory: (
        catalogItemRepository: Repository<CatalogItemEntity>,
        catalogTypeRepository: Repository<CatalogTypeEntity>,
        catalogBrandRepository: Repository<CatalogBrandEntity>,
        outboxRepository: Repository<OutboxEntity>,
        connection: Connection,
        outboxService: OutboxService
      ) =>
        new AppService(
          catalogItemRepository,
          catalogTypeRepository,
          catalogBrandRepository,
          outboxRepository,
          connection,
          outboxService
        ),
      inject: [
        getRepositoryToken(CatalogItemEntity),
        getRepositoryToken(CatalogTypeEntity),
        getRepositoryToken(CatalogBrandEntity),
        getRepositoryToken(OutboxEntity),
        Connection,
        OutboxService,
      ],
    },
  ],
})
export class AppModule {}
