import { Connection } from 'typeorm';
import { orderStatuses } from '../fixtures/order-statuses';

export async function seedOrderStatuses(connection: Connection): Promise<void> {
  await connection
    .createQueryBuilder()
    .insert()
    .into('order_statuses')
    .values(orderStatuses)
    .execute();
}
