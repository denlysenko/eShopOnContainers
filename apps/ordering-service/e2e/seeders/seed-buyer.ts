import { Connection } from 'typeorm';
import { buyer } from '../fixtures/buyer';

export async function seedBuyer(connection: Connection): Promise<void> {
  await connection
    .createQueryBuilder()
    .insert()
    .into('buyers')
    .values(buyer)
    .execute();
}
