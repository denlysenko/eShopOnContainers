import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BASKET_REPOSITORY,
  INBOX_REPOSITORY,
  OUTBOX_REPOSITORY,
} from '../../application';
import { BasketItemEntity } from './entities/basket-item.entity';
import { InboxEntity } from './entities/inbox.entity';
import { OutboxEntity } from './entities/outbox.entity';
import { TypeOrmBasketRepository } from './repositories/typeorm-basket.repository';
import { TypeOrmInboxRepository } from './repositories/typeorm-inbox.repository';
import { TypeOrmOutboxRepository } from './repositories/typeorm-outbox.repository';
import { TypeOrmUnitOfWork } from './typeorm-unit-of-work';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers: Provider<any>[] = [
  TypeOrmUnitOfWork,
  {
    provide: BASKET_REPOSITORY,
    useClass: TypeOrmBasketRepository,
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
    TypeOrmModule.forFeature([OutboxEntity, InboxEntity, BasketItemEntity]),
  ],
  providers,
  exports: [TypeOrmModule, ...providers],
})
export class DatabaseModule {}
