import { Connection } from 'typeorm';
import { orderItems } from '../fixtures/order-items';

export async function seedOrderItems(connection: Connection): Promise<void> {
  await connection
    .createQueryBuilder()
    .insert()
    .into('order_items')
    .values(orderItems)
    .execute();
}
