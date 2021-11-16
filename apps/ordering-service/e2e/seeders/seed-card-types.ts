import { Connection } from 'typeorm';
import { cardTypes } from '../fixtures/card-types';

export async function seedCardTypes(connection: Connection): Promise<void> {
  await connection
    .createQueryBuilder()
    .insert()
    .into('card_types')
    .values(cardTypes)
    .execute();
}
