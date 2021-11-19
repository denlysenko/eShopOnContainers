import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'basket_items' })
export class BasketItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  buyerId: string;

  @Column()
  productId: number;

  @Column()
  productName: string;

  @Column({ type: 'float' })
  unitPrice: number;

  @Column({ type: 'float' })
  oldUnitPrice: number;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  pictureUrl: string;
}
