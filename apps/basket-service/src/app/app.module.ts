import {
  EventBusClient,
  EVENT_BUS_CLIENT,
} from '@e-shop-on-containers/event-bus';
import { ILogger, LOGGER } from '@e-shop-on-containers/logger';
import { Logger, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AppService,
  BasketRepository,
  BASKET_REPOSITORY,
  OutboxRepository,
  OutboxService,
  OUTBOX_REPOSITORY,
  UnitOfWork,
} from './application';
import { AppController } from './controllers';
import {
  DatabaseModule,
  MessageProcessor,
  ProductPriceChangedConsumer,
  RbmqEventBusClient,
  RBMQ_MESSAGE_BUS_CLIENT,
  TypeOrmUnitOfWork,
} from './infrastructure';

export const queue = process.env.EVENT_QUEUE_NAME;
export const eventBusConnection =
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
  controllers: [AppController, ProductPriceChangedConsumer],
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
      provide: LOGGER,
      useClass: Logger,
    },
    {
      provide: OutboxService,
      useFactory: (
        eventBusClient: EventBusClient,
        outboxRepository: OutboxRepository,
        logger: ILogger
      ) => new OutboxService(eventBusClient, outboxRepository, logger),
      inject: [EVENT_BUS_CLIENT, OUTBOX_REPOSITORY, LOGGER],
    },
    {
      provide: AppService,
      useFactory: (
        basketRepository: BasketRepository,
        outboxRepository: OutboxRepository,
        unitOfWork: UnitOfWork
      ) => new AppService(basketRepository, outboxRepository, unitOfWork),
      inject: [BASKET_REPOSITORY, OUTBOX_REPOSITORY, TypeOrmUnitOfWork],
    },
  ],
})
export class AppModule {}
