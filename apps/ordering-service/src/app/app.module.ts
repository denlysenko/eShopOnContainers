import {
  EventBusClient,
  EVENT_BUS_CLIENT,
} from '@e-shop-on-containers/event-bus';
import { ILogger, LOGGER } from '@e-shop-on-containers/logger';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CancelOrderCommandHandler,
  createDomainEventsHandlers,
  CreateOrderCommandHandler,
  CreateOrderDraftCommandHandler,
  Mediator,
  OrderQueries,
  OutboxRepository,
  OutboxService,
  OUTBOX_REPOSITORY,
  SetAwaitingValidationStatusCommandHandler,
  SetPaidStatusCommandHandler,
  SetStockConfirmedStatusCommandHandler,
  SetStockRejectedStatusCommandHandler,
  ShipOrderCommandHandler,
} from './application';
import { AppController, HealthController } from './controllers';
import {
  BuyerRepository,
  BUYER_REPOSITORY,
  OrderRepository,
  ORDER_REPOSITORY,
  UnitOfWork,
} from './domain';
import {
  DatabaseModule,
  GracePeriodConfirmedConsumer,
  MessageProcessor,
  OrderPaymentFailedConsumer,
  OrderPaymentSucceededConsumer,
  OrderStockConfirmedConsumer,
  OrderStockRejectedConsumer,
  RbmqEventBusClient,
  TypeOrmUnitOfWork,
  UserCheckoutAcceptedConsumer,
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
    GracePeriodConfirmedConsumer,
    OrderPaymentFailedConsumer,
    OrderPaymentSucceededConsumer,
    OrderStockConfirmedConsumer,
    OrderStockRejectedConsumer,
    UserCheckoutAcceptedConsumer,
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
      provide: OrderQueries,
      useFactory: (
        ordersRepository: OrderRepository,
        buyerRepository: BuyerRepository
      ) => new OrderQueries(ordersRepository, buyerRepository),
      inject: [ORDER_REPOSITORY, BUYER_REPOSITORY],
    },
    {
      provide: CancelOrderCommandHandler,
      useFactory: (orderRepository: OrderRepository, logger: ILogger) =>
        new CancelOrderCommandHandler(orderRepository, logger),
      inject: [ORDER_REPOSITORY, LOGGER],
    },
    {
      provide: CreateOrderCommandHandler,
      useFactory: (
        orderRepository: OrderRepository,
        outboxRepository: OutboxRepository,
        unitOfWork: UnitOfWork,
        logger: ILogger
      ) =>
        new CreateOrderCommandHandler(
          orderRepository,
          outboxRepository,
          unitOfWork,
          logger
        ),
      inject: [ORDER_REPOSITORY, OUTBOX_REPOSITORY, TypeOrmUnitOfWork, LOGGER],
    },
    {
      provide: CreateOrderDraftCommandHandler,
      useFactory: (logger: ILogger) =>
        new CreateOrderDraftCommandHandler(logger),
      inject: [LOGGER],
    },
    {
      provide: SetAwaitingValidationStatusCommandHandler,
      useFactory: (orderRepository: OrderRepository, logger: ILogger) =>
        new SetAwaitingValidationStatusCommandHandler(orderRepository, logger),
      inject: [ORDER_REPOSITORY, LOGGER],
    },
    {
      provide: SetPaidStatusCommandHandler,
      useFactory: (orderRepository: OrderRepository, logger: ILogger) =>
        new SetPaidStatusCommandHandler(orderRepository, logger),
      inject: [ORDER_REPOSITORY, LOGGER],
    },
    {
      provide: SetStockConfirmedStatusCommandHandler,
      useFactory: (orderRepository: OrderRepository, logger: ILogger) =>
        new SetStockConfirmedStatusCommandHandler(orderRepository, logger),
      inject: [ORDER_REPOSITORY, LOGGER],
    },
    {
      provide: SetStockRejectedStatusCommandHandler,
      useFactory: (orderRepository: OrderRepository, logger: ILogger) =>
        new SetStockRejectedStatusCommandHandler(orderRepository, logger),
      inject: [ORDER_REPOSITORY, LOGGER],
    },
    {
      provide: ShipOrderCommandHandler,
      useFactory: (orderRepository: OrderRepository, logger: ILogger) =>
        new ShipOrderCommandHandler(orderRepository, logger),
      inject: [ORDER_REPOSITORY, LOGGER],
    },
    {
      provide: Mediator,
      useFactory: (
        cancelOrderCommandHandler: CancelOrderCommandHandler,
        createOrderCommandHandler: CreateOrderCommandHandler,
        createOrderDraftCommandHandler: CreateOrderDraftCommandHandler,
        setAwaitingValidationStatusCommandHandler: SetAwaitingValidationStatusCommandHandler,
        setPaidStatusCommandHandler: SetPaidStatusCommandHandler,
        setStockConfirmedStatusCommandHandler: SetStockConfirmedStatusCommandHandler,
        setStockRejectedStatusCommandHandler: SetStockRejectedStatusCommandHandler,
        shipOrderCommandHandler: ShipOrderCommandHandler
      ) => {
        const mediator = new Mediator();
        mediator.register([
          cancelOrderCommandHandler,
          createOrderCommandHandler,
          createOrderDraftCommandHandler,
          setAwaitingValidationStatusCommandHandler,
          setPaidStatusCommandHandler,
          setStockConfirmedStatusCommandHandler,
          setStockRejectedStatusCommandHandler,
          shipOrderCommandHandler,
        ]);

        return mediator;
      },
      inject: [
        CancelOrderCommandHandler,
        CreateOrderCommandHandler,
        CreateOrderDraftCommandHandler,
        SetAwaitingValidationStatusCommandHandler,
        SetPaidStatusCommandHandler,
        SetStockConfirmedStatusCommandHandler,
        SetStockRejectedStatusCommandHandler,
        ShipOrderCommandHandler,
      ],
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly _moduleRef: ModuleRef) {}

  public onModuleInit(): void {
    const orderRepository: OrderRepository = this._moduleRef.get(
      ORDER_REPOSITORY,
      { strict: false }
    );
    const buyerRepository: BuyerRepository = this._moduleRef.get(
      BUYER_REPOSITORY,
      { strict: false }
    );
    const outboxRepository: OutboxRepository = this._moduleRef.get(
      OUTBOX_REPOSITORY,
      { strict: false }
    );
    const logger: ILogger = this._moduleRef.get(LOGGER, { strict: false });

    createDomainEventsHandlers(
      orderRepository,
      buyerRepository,
      outboxRepository,
      logger
    );
  }
}
