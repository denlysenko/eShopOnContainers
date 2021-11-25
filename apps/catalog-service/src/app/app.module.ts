import {
  EventBusClient,
  EVENT_BUS_CLIENT,
} from '@e-shop-on-containers/event-bus';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Logger, Module } from '@nestjs/common';
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
  UnitOfWork,
} from './application';
import { AppController } from './controllers';
import {
  DatabaseModule,
  MessageProcessor,
  RbmqEventBusClient,
  TypeOrmUnitOfWork,
} from './infrastructure';

const eventBusConnection =
  process.env.EVENT_BUS_CONNECTION || 'amqp://localhost:5672';
const exchange = process.env.EXCHANGE;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.PG_CONNECTION_STRING,
      synchronize: false,
      autoLoadEntities: true,
    }),
    ScheduleModule.forRoot(),
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: eventBusConnection,
      exchanges: [
        {
          name: exchange,
          type: 'topic',
        },
      ],
    }),
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
