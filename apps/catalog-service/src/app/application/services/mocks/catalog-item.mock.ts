import { catalogBrandMock } from './catalog-brand.mock';
import { catalogTypeMock } from './catalog-type.mock';

export const catalogItemMock = {
  id: 1,
  name: 'Catalog Item',
  description: 'Catalog item description',
  price: 10,
  pictureFileName: '1.png',
  pictureUri: '',
  catalogTypeId: 3,
  catalogType: catalogTypeMock,
  catalogBrandId: 4,
  catalogBrand: catalogBrandMock,
  availableStock: 20,
  restockThreshold: 0,
  maxStockThreshold: 0,
  onReorder: false,
};
