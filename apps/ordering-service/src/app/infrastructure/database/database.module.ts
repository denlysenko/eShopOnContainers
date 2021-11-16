import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INBOX_REPOSITORY, OUTBOX_REPOSITORY } from '../../application';
import { BUYER_REPOSITORY, ORDER_REPOSITORY } from '../../domain';
import { BuyerEntity } from './entities/buyer.entity';
import { CardTypeEntity } from './entities/card-type.entity';
import { InboxEntity } from './entities/inbox.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { OrderStatusEntity } from './entities/order-status.entity';
import { OrderEntity } from './entities/order.entity';
import { OutboxEntity } from './entities/outbox.entity';
import { PaymentMethodEntity } from './entities/payment-method.entity';
import { TypeOrmBuyerRepository } from './repositories/typeorm-buyer.repository';
import { TypeOrmInboxRepository } from './repositories/typeorm-inbox.repository';
import { TypeOrmOrderRepository } from './repositories/typeorm-order.repository';
import { TypeOrmOutboxRepository } from './repositories/typeorm-outbox.repository';
import { TypeOrmUnitOfWork } from './typeorm-unit-of-work';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers: Provider<any>[] = [
  TypeOrmUnitOfWork,
  {
    provide: ORDER_REPOSITORY,
    useClass: TypeOrmOrderRepository,
  },
  {
    provide: BUYER_REPOSITORY,
    useClass: TypeOrmBuyerRepository,
  },
  {
    provide: OUTBOX_REPOSITORY,
    useClass: TypeOrmOutboxRepository,
  },
  {
    provide: INBOX_REPOSITORY,
    useClass: TypeOrmInboxRepository,
  },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BuyerEntity,
      CardTypeEntity,
      OrderEntity,
      OrderItemEntity,
      OrderStatusEntity,
      PaymentMethodEntity,
      OutboxEntity,
      InboxEntity,
    ]),
  ],
  providers,
  exports: [TypeOrmModule, ...providers],
})
export class DatabaseModule {}
