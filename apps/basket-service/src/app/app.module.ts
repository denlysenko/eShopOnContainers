import {
  EventBusClient,
  EVENT_BUS_CLIENT,
} from '@e-shop-on-containers/event-bus';
import { ILogger, LOGGER } from '@e-shop-on-containers/logger';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Logger, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
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
import { AppController, HealthController } from './controllers';
import {
  DatabaseModule,
  MessageProcessor,
  ProductPriceChangedConsumer,
  RbmqEventBusClient,
  TypeOrmUnitOfWork,
} from './infrastructure';

const eventBusConnection =
  process.env.EVENT_BUS_CONNECTION || 'amqp://localhost:5672';
export const exchange = process.env.EXCHANGE;

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
      connectionInitOptions: {
        wait: false,
      },
    }),
    DatabaseModule,
    TerminusModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    MessageProcessor,
    ProductPriceChangedConsumer,
    {
      provide: EVENT_BUS_CLIENT,
      useClass: RbmqEventBusClient,
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
