import {
  EventBusClient,
  EVENT_BUS_CLIENT,
} from '@e-shop-on-containers/event-bus';
import { Logger, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AppService,
  CatalogBrandRepository,
  CatalogItemRepository,
  CatalogTypeRepository,
  CATALOG_BRAND_REPOSITORY,
  CATALOG_ITEM_REPOSITORY,
  CATALOG_TYPE_REPOSITORY,
  OutboxRepository,
  OutboxService,
  OUTBOX_REPOSITORY,
  RBMQ_MESSAGE_BUS_CLIENT,
  UnitOfWork,
} from './application';
import { AppController } from './controllers';
import {
  DatabaseModule,
  MessageProcessor,
  RbmqEventBusClient,
  TypeOrmUnitOfWork,
} from './infrastructure';

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
    MessageProcessor,
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
      provide: OutboxService,
      useFactory: (
        eventBusClient: EventBusClient,
        outboxRepository: OutboxRepository
      ) =>
        new OutboxService(
          eventBusClient,
          outboxRepository,
          new Logger(OutboxService.name)
        ),
      inject: [EVENT_BUS_CLIENT, OUTBOX_REPOSITORY],
    },
    {
      provide: AppService,
      useFactory: (
        catalogItemRepository: CatalogItemRepository,
        catalogTypeRepository: CatalogTypeRepository,
        catalogBrandRepository: CatalogBrandRepository,
        outboxRepository: OutboxRepository,
        unitOfWork: UnitOfWork
      ) =>
        new AppService(
          catalogItemRepository,
          catalogTypeRepository,
          catalogBrandRepository,
          outboxRepository,
          unitOfWork
        ),
      inject: [
        CATALOG_ITEM_REPOSITORY,
        CATALOG_TYPE_REPOSITORY,
        CATALOG_BRAND_REPOSITORY,
        OUTBOX_REPOSITORY,
        TypeOrmUnitOfWork,
      ],
    },
  ],
})
export class AppModule {}
