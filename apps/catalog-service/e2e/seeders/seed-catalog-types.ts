import { Connection } from 'typeorm';
import { catalogTypes } from '../fixtures/catalog-types';

export async function seedCatalogTypes(connection: Connection): Promise<void> {
  await connection
    .createQueryBuilder()
    .insert()
    .into('catalog_type')
    .values(catalogTypes)
    .execute();
}
