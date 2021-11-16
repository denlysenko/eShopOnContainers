import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity({ name: 'order_items' })
export class OrderItemEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  orderId: string;

  @Column({ nullable: true })
  discount: number;

  @Column()
  productId: number;

  @Column()
  productName: string;

  @Column({ type: 'float' })
  unitPrice: number;

  @Column()
  units: number;

  @Column({ nullable: true })
  pictureUrl: string;

  @ManyToOne(() => OrderEntity, (order) => order.orderItems)
  order: OrderEntity;
}
