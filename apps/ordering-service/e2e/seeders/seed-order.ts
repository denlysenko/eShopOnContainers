import { Connection } from 'typeorm';
import { order } from '../fixtures/order';

export async function seedOrder(connection: Connection): Promise<void> {
  await connection
    .createQueryBuilder()
    .insert()
    .into('orders')
    .values(order)
    .execute();
}
