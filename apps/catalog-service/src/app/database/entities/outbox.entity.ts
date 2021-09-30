import { Column, Entity, PrimaryColumn } from 'typeorm';
import { MessageStatus } from '../../constants';

@Entity({ name: 'outbox' })
export class OutboxEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'jsonb' })
  payload: string;

  @Column({ default: MessageStatus.PENDING })
  status: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  updatedAt: Date;
}
