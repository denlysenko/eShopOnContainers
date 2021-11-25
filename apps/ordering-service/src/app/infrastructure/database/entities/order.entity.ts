import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { BuyerEntity } from './buyer.entity';
import { OrderItemEntity } from './order-item.entity';
import { OrderStatusEntity } from './order-status.entity';
import { PaymentMethodEntity } from './payment-method.entity';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column()
  zipCode: string;

  @Column()
  country: string;

  @Column({ type: 'timestamp' })
  orderDate: Date;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems: OrderItemEntity[];

  @Column({ nullable: true })
  paymentMethodId: number;

  @ManyToOne(() => PaymentMethodEntity)
  paymentMethod: PaymentMethodEntity;

  @Column({ nullable: true })
  buyerId: number;

  @ManyToOne(() => BuyerEntity)
  buyer: BuyerEntity;

  @Column()
  orderStatusId: number;

  @ManyToOne(() => OrderStatusEntity)
  orderStatus: OrderStatusEntity;
}
