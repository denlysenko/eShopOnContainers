import { HttpStatus, ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { AppModule } from '../src/app/app.module';
import { DEFAULT_PAGE_SIZE } from '../src/app/application';
import { exceptionFactory } from '../src/app/exception.factory';
import {
  CatalogDomainExceptionFilter,
  EntityNotFoundExceptionFilter,
  MessageProcessor,
} from '../src/app/infrastructure';
import { catalogBrands } from './fixtures/catalog-brands';
import { catalogItems } from './fixtures/catalog-items';
import { catalogTypes } from './fixtures/catalog-types';
import { seedCatalogBrands } from './seeders/seed-catalog-brands';
import { seedCatalogItems } from './seeders/seed-catalog-items';
import { seedCatalogTypes } from './seeders/seed-catalog-types';

describe('Catalog service', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MessageProcessor)
      .useValue({})
      .compile();

    app = moduleRef.createNestApplication(new FastifyAdapter());
    app.useGlobalPipes(new ValidationPipe({ exceptionFactory }));
    app.useGlobalFilters(
      new CatalogDomainExceptionFilter(),
      new EntityNotFoundExceptionFilter()
    );
    await app.init();
  });

  beforeEach(async () => {
    const connection = app.get(Connection);

    await connection.synchronize(true);
    await Promise.all([
      seedCatalogTypes(connection),
      seedCatalogBrands(connection),
    ]);
    await seedCatalogItems(connection);
  });

  describe('/GET v1/catalog/items', () => {
    it('without query params', async () => {
      const response = await app.inject({
        method: 'GET',
        path: '/v1/catalog/items',
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(0);
      expect(body.pageSize).toBe(DEFAULT_PAGE_SIZE);
      expect(body.count).toBe(catalogItems.length);
      expect(body.data).toHaveLength(DEFAULT_PAGE_SIZE);
    });

    it('with pageIndex query param', async () => {
      const response = await app.inject({
        method: 'GET',
        path: '/v1/catalog/items?pageIndex=1',
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(1);
      expect(body.pageSize).toBe(DEFAULT_PAGE_SIZE);
      expect(body.count).toBe(catalogItems.length);
      expect(body.data).toHaveLength(catalogItems.length - DEFAULT_PAGE_SIZE);
    });

    it('with pageSize query param', async () => {
      const pageSize = 15;

      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items?pageSize=${pageSize}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(0);
      expect(body.pageSize).toBe(pageSize);
      expect(body.count).toBe(catalogItems.length);
      expect(body.data).toHaveLength(catalogItems.length);
    });

    it('with pageSize and pageIndex query params', async () => {
      const pageSize = 12;
      const pageIndex = 1;

      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items?pageSize=${pageSize}&pageIndex=${pageIndex}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(pageIndex);
      expect(body.pageSize).toBe(pageSize);
      expect(body.count).toBe(catalogItems.length);
      expect(body.data).toHaveLength(
        catalogItems.length - pageSize * pageIndex
      );
    });

    it('returns transformed records', async () => {
      const response = await app.inject({
        method: 'GET',
        path: '/v1/catalog/items',
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.data[0]).toEqual({
        id: 9,
        name: 'Cup<T> White Mu',
        description: 'Cup<T> White Mu',
        price: 12,
        pictureFileName: '9.png',
        pictureUri: '',
        catalogType: {
          id: 1,
          type: 'Mug',
        },
        catalogBrand: {
          id: 5,
          brand: 'Other',
        },
        availableStock: 76,
        restockThreshold: 0,
        maxStockThreshold: 0,
        onReorder: false,
      });
    });
  });

  describe('/GET v1/catalog/items/:id', () => {
    it('returns transformed record', async () => {
      const id = catalogItems[0].id;

      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/${id}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body).toEqual({
        id: 1,
        name: '.NET Bot Black Hoodie',
        description: '.NET Bot Black Hoodie, and more',
        price: 19.5,
        pictureFileName: '1.png',
        pictureUri: '',
        catalogType: {
          id: 2,
          type: 'T-Shirt',
        },
        catalogBrand: {
          id: 2,
          brand: '.NET',
        },
        availableStock: 100,
        restockThreshold: 0,
        maxStockThreshold: 0,
        onReorder: false,
      });
    });

    it('returns 404 if record is not found', async () => {
      const id = 25;

      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/${id}`,
      });

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);

      const body = JSON.parse(response.body);

      expect(body.message).toBe(`Catalog Item with id ${id} not found`);
    });
  });

  describe('/GET v1/catalog/items/withname/:name', () => {
    const name = 'prism';

    it('without query params', async () => {
      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/withname/${name}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(0);
      expect(body.pageSize).toBe(DEFAULT_PAGE_SIZE);
      expect(body.count).toBe(2);
      expect(body.data).toHaveLength(2);
    });

    it('with pageIndex query param', async () => {
      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/withname/${name}?pageIndex=1`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(1);
      expect(body.pageSize).toBe(DEFAULT_PAGE_SIZE);
      expect(body.count).toBe(2);
      expect(body.data).toHaveLength(0);
    });

    it('with pageSize query param', async () => {
      const pageSize = 15;

      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/withname/${name}?pageSize=${pageSize}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(0);
      expect(body.pageSize).toBe(pageSize);
      expect(body.count).toBe(2);
      expect(body.data).toHaveLength(2);
    });

    it('with pageSize and pageIndex query params', async () => {
      const pageSize = 12;
      const pageIndex = 1;

      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/withname/${name}?pageSize=${pageSize}&pageIndex=${pageIndex}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(pageIndex);
      expect(body.pageSize).toBe(pageSize);
      expect(body.count).toBe(2);
      expect(body.data).toHaveLength(0);
    });

    it('returns transformed records', async () => {
      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/withname/${name}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.data[0]).toEqual({
        id: 3,
        name: 'Prism White T-Shirt',
        description: 'Prism White T-Shirt',
        price: 12,
        pictureFileName: '3.png',
        pictureUri: '',
        catalogType: {
          id: 2,
          type: 'T-Shirt',
        },
        catalogBrand: {
          id: 5,
          brand: 'Other',
        },
        availableStock: 56,
        restockThreshold: 0,
        maxStockThreshold: 0,
        onReorder: false,
      });
    });

    it('returns empty array if name not exists', async () => {
      const response = await app.inject({
        method: 'GET',
        path: '/v1/catalog/items/withname/not_exists',
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.count).toBe(0);
      expect(body.data).toHaveLength(0);
    });
  });

  describe('/GET v1/catalog/items/type/:catalogTypeId/brand/:catalogBrandId', () => {
    it('without query params', async () => {
      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/type/${catalogTypes[1].id}/brand/${catalogBrands[1].id}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(0);
      expect(body.pageSize).toBe(DEFAULT_PAGE_SIZE);
      expect(body.count).toBe(3);
      expect(body.data).toHaveLength(3);
    });

    it('with pageIndex query param', async () => {
      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/type/${catalogTypes[1].id}/brand/${catalogBrands[1].id}?pageIndex=1`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(1);
      expect(body.pageSize).toBe(DEFAULT_PAGE_SIZE);
      expect(body.count).toBe(3);
      expect(body.data).toHaveLength(0);
    });

    it('with pageSize query param', async () => {
      const pageSize = 15;

      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/type/${catalogTypes[1].id}/brand/${catalogBrands[1].id}?pageSize=${pageSize}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(0);
      expect(body.pageSize).toBe(pageSize);
      expect(body.count).toBe(3);
      expect(body.data).toHaveLength(3);
    });

    it('with pageSize and pageIndex query params', async () => {
      const pageSize = 12;
      const pageIndex = 1;

      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/type/${catalogTypes[1].id}/brand/${catalogBrands[1].id}?pageSize=${pageSize}&pageIndex=${pageIndex}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(pageIndex);
      expect(body.pageSize).toBe(pageSize);
      expect(body.count).toBe(3);
      expect(body.data).toHaveLength(0);
    });

    it('returns transformed records', async () => {
      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/type/${catalogTypes[1].id}/brand/${catalogBrands[1].id}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.data[0]).toEqual({
        id: 6,
        name: '.NET Blue Hoodie',
        description: '.NET Blue Hoodie',
        price: 12,
        pictureFileName: '6.png',
        pictureUri: '',
        catalogType: {
          id: 2,
          type: 'T-Shirt',
        },
        catalogBrand: {
          id: 2,
          brand: '.NET',
        },
        availableStock: 17,
        restockThreshold: 0,
        maxStockThreshold: 0,
        onReorder: false,
      });
    });

    it('returns empty array if catalog type not exists', async () => {
      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/type/100/brand/${catalogBrands[1].id}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.count).toBe(0);
      expect(body.data).toHaveLength(0);
    });

    it('returns empty array if catalog brand not exists', async () => {
      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/type/${catalogTypes[1].id}/brand/100`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.count).toBe(0);
      expect(body.data).toHaveLength(0);
    });
  });

  describe('/GET v1/catalog/items/type/all/brand/:catalogBrandId', () => {
    it('without query params', async () => {
      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/type/all/brand/${catalogBrands[1].id}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(0);
      expect(body.pageSize).toBe(DEFAULT_PAGE_SIZE);
      expect(body.count).toBe(6);
      expect(body.data).toHaveLength(6);
    });

    it('with pageIndex query param', async () => {
      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/type/all/brand/${catalogBrands[1].id}?pageIndex=1`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(1);
      expect(body.pageSize).toBe(DEFAULT_PAGE_SIZE);
      expect(body.count).toBe(6);
      expect(body.data).toHaveLength(0);
    });

    it('with pageSize query param', async () => {
      const pageSize = 15;

      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/type/all/brand/${catalogBrands[1].id}?pageSize=${pageSize}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(0);
      expect(body.pageSize).toBe(pageSize);
      expect(body.count).toBe(6);
      expect(body.data).toHaveLength(6);
    });

    it('with pageSize and pageIndex query params', async () => {
      const pageSize = 3;
      const pageIndex = 1;

      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/type/all/brand/${catalogBrands[1].id}?pageSize=${pageSize}&pageIndex=${pageIndex}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(pageIndex);
      expect(body.pageSize).toBe(pageSize);
      expect(body.count).toBe(6);
      expect(body.data).toHaveLength(3);
    });

    it('returns transformed records', async () => {
      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/type/all/brand/${catalogBrands[1].id}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.data[0]).toEqual({
        id: 2,
        name: '.NET Black & White Mug',
        description: '.NET Black & White Mug',
        price: 8.5,
        pictureFileName: '2.png',
        pictureUri: '',
        catalogType: {
          id: 1,
          type: 'Mug',
        },
        catalogBrand: {
          id: 2,
          brand: '.NET',
        },
        availableStock: 89,
        restockThreshold: 0,
        maxStockThreshold: 0,
        onReorder: true,
      });
    });

    it('returns empty array if catalog type not exists', async () => {
      const response = await app.inject({
        method: 'GET',
        path: '/v1/catalog/items/type/all/brand/100',
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.count).toBe(0);
      expect(body.data).toHaveLength(0);
    });
  });

  describe('/GET v1/catalog/items/type/:catalogTypeId/brand/all', () => {
    it('without query params', async () => {
      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/type/${catalogTypes[0].id}/brand/all`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(0);
      expect(body.pageSize).toBe(DEFAULT_PAGE_SIZE);
      expect(body.count).toBe(3);
      expect(body.data).toHaveLength(3);
    });

    it('with pageIndex query param', async () => {
      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/type/${catalogTypes[0].id}/brand/all?pageIndex=1`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(1);
      expect(body.pageSize).toBe(DEFAULT_PAGE_SIZE);
      expect(body.count).toBe(3);
      expect(body.data).toHaveLength(0);
    });

    it('with pageSize query param', async () => {
      const pageSize = 15;

      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/type/${catalogTypes[0].id}/brand/all?pageSize=${pageSize}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(0);
      expect(body.pageSize).toBe(pageSize);
      expect(body.count).toBe(3);
      expect(body.data).toHaveLength(3);
    });

    it('with pageSize and pageIndex query params', async () => {
      const pageSize = 3;
      const pageIndex = 1;

      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/type/${catalogTypes[0].id}/brand/all?pageSize=${pageSize}&pageIndex=${pageIndex}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.pageIndex).toBe(pageIndex);
      expect(body.pageSize).toBe(pageSize);
      expect(body.count).toBe(3);
      expect(body.data).toHaveLength(0);
    });

    it('returns transformed records', async () => {
      const response = await app.inject({
        method: 'GET',
        path: `/v1/catalog/items/type/${catalogTypes[0].id}/brand/all`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.data[0]).toEqual({
        id: 9,
        name: 'Cup<T> White Mu',
        description: 'Cup<T> White Mu',
        price: 12,
        pictureFileName: '9.png',
        pictureUri: '',
        catalogType: {
          id: 1,
          type: 'Mug',
        },
        catalogBrand: {
          id: 5,
          brand: 'Other',
        },
        availableStock: 76,
        restockThreshold: 0,
        maxStockThreshold: 0,
        onReorder: false,
      });
    });

    it('returns empty array if catalog type not exists', async () => {
      const response = await app.inject({
        method: 'GET',
        path: '/v1/catalog/items/type/all/brand/100',
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body.count).toBe(0);
      expect(body.data).toHaveLength(0);
    });
  });

  describe('/PATCH v1/catalog/items:id', () => {
    it('returns 404 if item not found', async () => {
      const id = 25;

      const response = await app.inject({
        method: 'PATCH',
        path: `/v1/catalog/items/${id}`,
        payload: {
          name: 'Updated',
        },
      });

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);

      const body = JSON.parse(response.body);

      expect(body.message).toBe(`Catalog Item with id ${id} not found`);
    });

    it('returns 422 if validation failed', async () => {
      const id = catalogItems[0].id;

      const response = await app.inject({
        method: 'PATCH',
        path: `/v1/catalog/items/${id}`,
        payload: {
          name: '',
        },
      });

      expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);

      const body = JSON.parse(response.body);

      expect(body.errors[0]).toEqual({
        message: ['name is required'],
        path: 'name',
        value: '',
      });
    });

    it('returns updated catalog item', async () => {
      const id = catalogItems[0].id;

      const response = await app.inject({
        method: 'PATCH',
        path: `/v1/catalog/items/${id}`,
        payload: {
          name: 'Updated',
        },
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body).toEqual({
        id: 1,
        name: 'Updated',
        description: '.NET Bot Black Hoodie, and more',
        price: 19.5,
        pictureFileName: '1.png',
        pictureUri: '',
        catalogType: {
          id: 2,
          type: 'T-Shirt',
        },
        catalogBrand: {
          id: 2,
          brand: '.NET',
        },
        availableStock: 100,
        restockThreshold: 0,
        maxStockThreshold: 0,
        onReorder: false,
      });
    });
  });

  describe('/POST v1/catalog/items', () => {
    it('returns 422 if validation failed', async () => {
      const response = await app.inject({
        method: 'POST',
        path: '/v1/catalog/items',
        payload: {
          description: '.NET Bot Black Hoodie, and more',
          pictureFileName: '1.png',
          pictureUri: '',
          catalogTypeId: 2,
          catalogBrandId: 2,
          availableStock: 100,
          restockThreshold: 0,
          maxStockThreshold: 0,
          onReorder: false,
        },
      });

      expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);

      const body = JSON.parse(response.body);

      expect(body.errors).toEqual([
        {
          message: [
            'name must have maximum length of 50 symbols',
            'name is required',
          ],
          path: 'name',
        },
        { message: ['price is required'], path: 'price' },
      ]);
    });

    it('returns created catalog item', async () => {
      const response = await app.inject({
        method: 'POST',
        path: '/v1/catalog/items',
        payload: {
          name: '.NET New item',
          description: '.NET New item',
          price: 9.25,
          pictureFileName: '10.png',
          pictureUri: '',
          catalogTypeId: 2,
          catalogBrandId: 2,
          availableStock: 123,
          restockThreshold: 0,
          maxStockThreshold: 0,
          onReorder: false,
        },
      });

      expect(response.statusCode).toBe(HttpStatus.CREATED);

      const body = JSON.parse(response.body);

      expect(body).toEqual({
        id: catalogItems.length + 1,
        name: '.NET New item',
        description: '.NET New item',
        price: 9.25,
        pictureFileName: '10.png',
        pictureUri: '',
        catalogType: {
          id: 2,
          type: 'T-Shirt',
        },
        catalogBrand: {
          id: 2,
          brand: '.NET',
        },
        availableStock: 123,
        restockThreshold: 0,
        maxStockThreshold: 0,
        onReorder: false,
      });
    });
  });

  describe('/DELETE v1/catalog/items/:id', () => {
    it('returns 404 if item not found', async () => {
      const id = 25;

      const response = await app.inject({
        method: 'DELETE',
        path: `/v1/catalog/items/${id}`,
      });

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);

      const body = JSON.parse(response.body);

      expect(body.message).toBe(`Catalog Item with id ${id} not found`);
    });

    it('returns 200 if item deleted successfully', async () => {
      const id = catalogItems[0].id;

      const response = await app.inject({
        method: 'DELETE',
        path: `/v1/catalog/items/${id}`,
      });

      expect(response.statusCode).toBe(HttpStatus.OK);
    });
  });

  describe('/GET v1/api/catalog/catalog-types', () => {
    it('returns found records', async () => {
      const response = await app.inject({
        method: 'GET',
        path: '/v1/catalog/catalog-types',
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body[0]).toEqual({
        id: 1,
        type: 'Mug',
      });
    });
  });

  describe('/PATCH v1/api/catalog/catalog-types/:id', () => {
    it('returns 404 if type not found', async () => {
      const id = 25;

      const response = await app.inject({
        method: 'PATCH',
        path: `/v1/catalog/catalog-types/${id}`,
        payload: {
          type: 'Updated',
        },
      });

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);

      const body = JSON.parse(response.body);

      expect(body.message).toBe(`Catalog Type with id ${id} not found`);
    });

    it('returns 422 if validation failed', async () => {
      const id = catalogTypes[0].id;

      const response = await app.inject({
        method: 'PATCH',
        path: `/v1/catalog/catalog-types/${id}`,
        payload: {
          type: '',
        },
      });

      expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);

      const body = JSON.parse(response.body);

      expect(body.errors[0]).toEqual({
        message: ['type is required'],
        path: 'type',
        value: '',
      });
    });

    it('returns updated catalog type', async () => {
      const id = catalogTypes[0].id;

      const response = await app.inject({
        method: 'PATCH',
        path: `/v1/catalog/catalog-types/${id}`,
        payload: {
          type: 'Updated',
        },
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body).toEqual({
        id: 1,
        type: 'Updated',
      });
    });
  });

  describe('/POST v1/api/catalog/catalog-types', () => {
    it('returns 422 if validation failed', async () => {
      const response = await app.inject({
        method: 'POST',
        path: '/v1/catalog/catalog-types',
        payload: {
          type: '',
        },
      });

      expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);

      const body = JSON.parse(response.body);

      expect(body.errors).toEqual([
        {
          message: ['type is required'],
          path: 'type',
          value: '',
        },
      ]);
    });

    it('returns created catalog type', async () => {
      const response = await app.inject({
        method: 'POST',
        path: '/v1/catalog/catalog-types',
        payload: {
          type: 'New catalog type',
        },
      });

      expect(response.statusCode).toBe(HttpStatus.CREATED);

      const body = JSON.parse(response.body);

      expect(body).toEqual({
        id: catalogTypes.length + 1,
        type: 'New catalog type',
      });
    });
  });

  describe('/GET v1/api/catalog/catalog-brands', () => {
    it('returns found records', async () => {
      const response = await app.inject({
        method: 'GET',
        path: '/v1/catalog/catalog-brands',
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body[0]).toEqual({
        id: 1,
        brand: 'Azure',
      });
    });
  });

  describe('/PATCH v1/api/catalog/catalog-brands/:id', () => {
    it('returns 404 if brand not found', async () => {
      const id = 25;

      const response = await app.inject({
        method: 'PATCH',
        path: `/v1/catalog/catalog-brands/${id}`,
        payload: {
          brand: 'Updated',
        },
      });

      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);

      const body = JSON.parse(response.body);

      expect(body.message).toBe(`Catalog Brand with id ${id} not found`);
    });

    it('returns 422 if validation failed', async () => {
      const id = catalogBrands[0].id;

      const response = await app.inject({
        method: 'PATCH',
        path: `/v1/catalog/catalog-brands/${id}`,
        payload: {
          brand: '',
        },
      });

      expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);

      const body = JSON.parse(response.body);

      expect(body.errors[0]).toEqual({
        message: ['brand is required'],
        path: 'brand',
        value: '',
      });
    });

    it('returns updated catalog brand', async () => {
      const id = catalogBrands[0].id;

      const response = await app.inject({
        method: 'PATCH',
        path: `/v1/catalog/catalog-brands/${id}`,
        payload: {
          brand: 'Updated',
        },
      });

      expect(response.statusCode).toBe(HttpStatus.OK);

      const body = JSON.parse(response.body);

      expect(body).toEqual({
        id: 1,
        brand: 'Updated',
      });
    });
  });

  describe('/POST v1/api/catalog/catalog-brands', () => {
    it('returns 422 if validation failed', async () => {
      const response = await app.inject({
        method: 'POST',
        path: '/v1/catalog/catalog-brands',
        payload: {
          brand: '',
        },
      });

      expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);

      const body = JSON.parse(response.body);

      expect(body.errors).toEqual([
        {
          message: ['brand is required'],
          path: 'brand',
          value: '',
        },
      ]);
    });

    it('returns created catalog brand', async () => {
      const response = await app.inject({
        method: 'POST',
        path: '/v1/catalog/catalog-brands',
        payload: {
          brand: 'New catalog brand',
        },
      });

      expect(response.statusCode).toBe(HttpStatus.CREATED);

      const body = JSON.parse(response.body);

      expect(body).toEqual({
        id: catalogBrands.length + 1,
        brand: 'New catalog brand',
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
