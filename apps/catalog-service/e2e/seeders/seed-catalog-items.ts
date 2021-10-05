import { Connection } from 'typeorm';
import { catalogItems } from '../fixtures/catalog-items';

export async function seedCatalogItems(connection: Connection): Promise<void> {
  await connection
    .createQueryBuilder()
    .insert()
    .into('catalog_item')
    .values(catalogItems)
    .execute();
}
