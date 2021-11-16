import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { BuyerEntity } from './buyer.entity';
import { CardTypeEntity } from './card-type.entity';

@Entity({ name: 'payment_methods' })
export class PaymentMethodEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  cardHolderName: string;

  @Column({ nullable: true })
  alias: string;

  @Column()
  cardNumber: string;

  @Column()
  cardSecurityNumber: string;

  @Column({ type: 'timestamp' })
  expiration: Date;

  @Column()
  cardTypeId: number;

  @ManyToOne(() => CardTypeEntity)
  cardType: CardTypeEntity;

  @Column()
  buyerId: number;

  @ManyToOne(() => BuyerEntity, (buyer) => buyer.paymentMethods)
  buyer: BuyerEntity;
}
