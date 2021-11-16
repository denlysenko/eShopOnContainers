import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'order_statuses' })
export class OrderStatusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
