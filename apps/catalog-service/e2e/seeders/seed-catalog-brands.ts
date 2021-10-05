import { Connection } from 'typeorm';
import { catalogBrands } from '../fixtures/catalog-brands';

export async function seedCatalogBrands(connection: Connection): Promise<void> {
  await connection
    .createQueryBuilder()
    .insert()
    .into('catalog_brand')
    .values(catalogBrands)
    .execute();
}
