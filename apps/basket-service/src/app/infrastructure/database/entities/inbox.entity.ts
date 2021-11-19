import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'inbox' })
export class InboxEntity {
  @PrimaryColumn()
  id: string;
}
