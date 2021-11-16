import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'card_types' })
export class CardTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
