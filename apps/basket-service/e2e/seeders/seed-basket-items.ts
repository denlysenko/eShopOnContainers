import { Connection } from 'typeorm';
import { basketItem } from '../fixtures/basket-item';

export async function seedBasketItems(connection: Connection): Promise<void> {
  await connection
    .createQueryBuilder()
    .insert()
    .into('basket_items')
    .values(basketItem)
    .execute();
}
