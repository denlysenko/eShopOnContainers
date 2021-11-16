import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { PaymentMethodEntity } from './payment-method.entity';

@Entity({ name: 'buyers' })
export class BuyerEntity {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  identityGuid: string;

  @Column()
  name: string;

  @OneToMany(
    () => PaymentMethodEntity,
    (paymentMethod) => paymentMethod.buyer,
    { onDelete: 'CASCADE' }
  )
  paymentMethods: PaymentMethodEntity[];
}
