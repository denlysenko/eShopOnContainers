import 'reflect-metadata';
import { AppService } from './app.service';
import { catalogBrandRepositoryMock } from './mocks/catalog-brand-repository.mock';
import { catalogBrandMock } from './mocks/catalog-brand.mock';
import { catalogTypeRepositoryMock } from './mocks/catalog-type-repository.mock';
import { catalogItemMock } from './mocks/catalog-item.mock';
import { catalogItemRepositoryMock } from './mocks/catalog-item-repository.mock';
import { outboxRepositoryMock } from './mocks/outbox-repository.mock';
import { catalogTypeMock } from './mocks/catalog-type.mock';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { unitOfWorkMock } from './mocks/unit-of-work.mock';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService(
      catalogItemRepositoryMock,
      catalogTypeRepositoryMock,
      catalogBrandRepositoryMock,
      outboxRepositoryMock,
      unitOfWorkMock
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getItems', () => {
    const pageSize = 15;
    const pageIndex = 2;

    beforeEach(() => {
      jest
        .spyOn(catalogItemRepositoryMock, 'findAll')
        .mockResolvedValue([[catalogItemMock], 1]);
    });

    it('should call findAll with correct params', async () => {
      await service.getItems(pageSize, pageIndex);

      expect(catalogItemRepositoryMock.findAll).toHaveBeenCalledWith(
        pageSize * pageIndex,
        pageSize
      );
    });

    it('should transform to CatalogReadDTO', async () => {
      const catalogReadDto = await service.getItems(pageSize, pageIndex);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { catalogBrandId: _, catalogTypeId: __, ...rest } = catalogItemMock;

      expect(catalogReadDto).toEqual({
        pageIndex,
        pageSize,
        count: 1,
        data: [rest],
      });
    });
  });

  describe('getItemById', () => {
    beforeEach(() => {
      jest
        .spyOn(catalogItemRepositoryMock, 'findById')
        .mockResolvedValue(catalogItemMock);
    });

    it('should call findById with correct params', async () => {
      await service.getItemById(catalogItemMock.id);

      expect(catalogItemRepositoryMock.findById).toHaveBeenCalledWith(
        catalogItemMock.id
      );
    });

    it('should throw EntityNotFoundException', async () => {
      jest
        .spyOn(catalogItemRepositoryMock, 'findById')
        .mockResolvedValueOnce(null);

      try {
        await service.getItemById(catalogItemMock.id);
      } catch (error) {
        expect(error).toBeInstanceOf(EntityNotFoundException);
      }
    });

    it('should transform to CatalogReadDTO', async () => {
      const catalogReadDto = await service.getItemById(catalogItemMock.id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { catalogBrandId: _, catalogTypeId: __, ...rest } = catalogItemMock;

      expect(catalogReadDto).toEqual(rest);
    });
  });

  describe('getItemsByName', () => {
    const pageSize = 15;
    const pageIndex = 2;
    const name = 'Name';

    beforeEach(() => {
      jest
        .spyOn(catalogItemRepositoryMock, 'findAllByName')
        .mockResolvedValue([[catalogItemMock], 1]);
    });

    it('should call findAndCount with correct params', async () => {
      await service.getItemsByName(name, pageSize, pageIndex);

      expect(catalogItemRepositoryMock.findAllByName).toHaveBeenCalledWith(
        name,
        pageSize * pageIndex,
        pageSize
      );
    });

    it('should transform to CatalogReadDTO', async () => {
      const catalogReadDto = await service.getItemsByName(
        name,
        pageSize,
        pageIndex
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { catalogBrandId: _, catalogTypeId: __, ...rest } = catalogItemMock;

      expect(catalogReadDto).toEqual({
        pageIndex,
        pageSize,
        count: 1,
        data: [rest],
      });
    });
  });

  describe('getItemsByTypeIdAndBrandId', () => {
    const pageSize = 15;
    const pageIndex = 2;

    beforeEach(() => {
      jest
        .spyOn(catalogItemRepositoryMock, 'findAllByTypeAndBrand')
        .mockResolvedValue([[catalogItemMock], 1]);
    });

    it('should call findAndCount with correct params', async () => {
      await service.getItemsByTypeIdAndBrandId(
        catalogTypeMock.id,
        catalogBrandMock.id,
        pageSize,
        pageIndex
      );

      expect(
        catalogItemRepositoryMock.findAllByTypeAndBrand
      ).toHaveBeenCalledWith(
        catalogTypeMock.id,
        catalogBrandMock.id,
        pageSize * pageIndex,
        pageSize
      );
    });

    it('should transform to CatalogReadDTO', async () => {
      const catalogReadDto = await service.getItemsByTypeIdAndBrandId(
        catalogTypeMock.id,
        catalogBrandMock.id,
        pageSize,
        pageIndex
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { catalogBrandId: _, catalogTypeId: __, ...rest } = catalogItemMock;

      expect(catalogReadDto).toEqual({
        pageIndex,
        pageSize,
        count: 1,
        data: [rest],
      });
    });
  });

  describe('getItemsByBrandId', () => {
    const pageSize = 15;
    const pageIndex = 2;

    beforeEach(() => {
      jest
        .spyOn(catalogItemRepositoryMock, 'findAllByBrand')
        .mockResolvedValue([[catalogItemMock], 1]);
    });

    it('should call findAndCount with correct params', async () => {
      await service.getItemsByBrandId(catalogBrandMock.id, pageSize, pageIndex);

      expect(catalogItemRepositoryMock.findAllByBrand).toHaveBeenCalledWith(
        catalogBrandMock.id,
        pageSize * pageIndex,
        pageSize
      );
    });

    it('should transform to CatalogReadDTO', async () => {
      const catalogReadDto = await service.getItemsByBrandId(
        catalogBrandMock.id,
        pageSize,
        pageIndex
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { catalogBrandId: _, catalogTypeId: __, ...rest } = catalogItemMock;

      expect(catalogReadDto).toEqual({
        pageIndex,
        pageSize,
        count: 1,
        data: [rest],
      });
    });
  });

  describe('updateCatalogItem', () => {
    beforeEach(() => {
      jest
        .spyOn(catalogItemRepositoryMock, 'findOne')
        .mockResolvedValue(catalogItemMock);
      jest
        .spyOn(catalogItemRepositoryMock, 'findById')
        .mockResolvedValue(catalogItemMock);
    });

    it('should call findOne', async () => {
      await service.updateCatalogItem(catalogItemMock.id, {});

      expect(catalogItemRepositoryMock.findOne).toHaveBeenCalledWith(
        catalogItemMock.id
      );
    });

    it('should throw EntityNotFoundException', async () => {
      jest
        .spyOn(catalogItemRepositoryMock, 'findOne')
        .mockResolvedValueOnce(null);

      try {
        await service.updateCatalogItem(catalogItemMock.id, {});
      } catch (error) {
        expect(error).toBeInstanceOf(EntityNotFoundException);
      }
    });

    it('should update and not save event to outbox if price is not passed', async () => {
      const updateDto = {
        name: 'New name',
      };

      await service.updateCatalogItem(catalogItemMock.id, updateDto);

      expect(outboxRepositoryMock.create).not.toHaveBeenCalled();
      expect(catalogItemRepositoryMock.update).toHaveBeenCalledWith(
        catalogItemMock.id,
        updateDto
      );
    });

    it('should update and not save event to outbox if price is not changed', async () => {
      const updateDto = {
        name: 'New name',
        price: catalogItemMock.price,
      };

      await service.updateCatalogItem(catalogItemMock.id, updateDto);

      expect(outboxRepositoryMock.create).not.toHaveBeenCalled();
      expect(catalogItemRepositoryMock.update).toHaveBeenCalledWith(
        catalogItemMock.id,
        updateDto
      );
    });

    it('should update and save event to outbox if price is changed', async () => {
      const updateDto = {
        name: 'New name',
        price: 15,
      };

      jest
        .spyOn(unitOfWorkMock, 'withTransaction')
        .mockImplementationOnce(async (callback: () => void) => {
          callback();
        });

      await service.updateCatalogItem(catalogItemMock.id, updateDto);

      expect(outboxRepositoryMock.create).toHaveBeenCalled();
      expect(catalogItemRepositoryMock.update).toHaveBeenCalledWith(
        catalogItemMock.id,
        updateDto
      );
    });

    it('should return transformed updated item', async () => {
      const updateDto = {
        name: 'New name',
      };

      const catalogItem = await service.updateCatalogItem(
        catalogItemMock.id,
        updateDto
      );

      jest.resetAllMocks();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { catalogBrandId: _, catalogTypeId: __, ...rest } = catalogItemMock;
      expect(catalogItem).toEqual(rest);
    });
  });

  describe('createCatalogItem', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let createCatalogItemDto: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let createdCatalogItem: any;

    beforeEach(() => {
      createCatalogItemDto = {
        name: 'Created catalog item',
        description: 'Created catalog item description',
        price: 1,
        pictureFileName: 'picture.png',
        catalogTypeId: catalogTypeMock.id,
        catalogBrandId: catalogBrandMock.id,
      };

      createdCatalogItem = {
        ...createCatalogItemDto,
        id: 2,
      };

      jest
        .spyOn(catalogItemRepositoryMock, 'create')
        .mockReturnValue(createdCatalogItem);
      jest
        .spyOn(catalogItemRepositoryMock, 'findById')
        .mockResolvedValue(catalogItemMock);
    });

    it('should create and insert new catalog item', async () => {
      await service.createCatalogItem(createCatalogItemDto);

      expect(catalogItemRepositoryMock.create).toHaveBeenCalledWith(
        createCatalogItemDto
      );
    });

    it('should return transformed created catalog item', async () => {
      const catalogItem = await service.createCatalogItem(createCatalogItemDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { catalogBrandId: _, catalogTypeId: __, ...rest } = catalogItemMock;

      expect(catalogItem).toEqual(rest);
    });
  });

  describe('deleteCatalogItem', () => {
    beforeEach(() => {
      jest
        .spyOn(catalogItemRepositoryMock, 'findOne')
        .mockResolvedValue(catalogItemMock);

      jest.spyOn(catalogItemRepositoryMock, 'delete').mockResolvedValue(null);
    });

    it('should call findOne with correct params', async () => {
      await service.deleteCatalogItem(catalogItemMock.id);

      expect(catalogItemRepositoryMock.findOne).toHaveBeenCalledWith(
        catalogItemMock.id
      );
    });

    it('should throw EntityNotFoundException', async () => {
      jest
        .spyOn(catalogItemRepositoryMock, 'findOne')
        .mockResolvedValueOnce(null);

      try {
        await service.deleteCatalogItem(catalogItemMock.id);
      } catch (error) {
        expect(error).toBeInstanceOf(EntityNotFoundException);
      }
    });

    it('should call delete', async () => {
      await service.deleteCatalogItem(catalogItemMock.id);

      expect(catalogItemRepositoryMock.delete).toHaveBeenCalledWith(
        catalogItemMock.id
      );
    });
  });

  describe('getCatalogTypes', () => {
    beforeEach(() => {
      jest
        .spyOn(catalogTypeRepositoryMock, 'findAll')
        .mockResolvedValue([catalogTypeMock]);
    });

    it('should call findAll', async () => {
      await service.getCatalogTypes();

      expect(catalogTypeRepositoryMock.findAll).toHaveBeenCalled();
    });

    it('should return transformed catalog types', async () => {
      expect(await service.getCatalogTypes()).toEqual([catalogTypeMock]);
    });
  });

  describe('updateCatalogType', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let updateCatalogTypeDto: any;

    beforeEach(() => {
      updateCatalogTypeDto = {
        type: 'Updated',
      };

      jest
        .spyOn(catalogTypeRepositoryMock, 'findById')
        .mockResolvedValue(catalogTypeMock);
      jest
        .spyOn(catalogTypeRepositoryMock, 'update')
        .mockResolvedValue(catalogTypeMock);
    });

    it('should call findById', async () => {
      await service.updateCatalogType(catalogTypeMock.id, updateCatalogTypeDto);

      expect(catalogTypeRepositoryMock.findById).toHaveBeenCalledWith(
        catalogTypeMock.id
      );
    });

    it('should throw EntityNotFoundException', async () => {
      jest
        .spyOn(catalogTypeRepositoryMock, 'findById')
        .mockResolvedValueOnce(null);

      try {
        await service.updateCatalogType(
          catalogTypeMock.id,
          updateCatalogTypeDto
        );
      } catch (error) {
        expect(error).toBeInstanceOf(EntityNotFoundException);
      }
    });

    it('should transform updated type', async () => {
      const updatedCatalogType = await service.updateCatalogType(
        catalogTypeMock.id,
        updateCatalogTypeDto
      );

      expect(updatedCatalogType).toEqual(catalogTypeMock);
    });
  });

  describe('createCatalogType', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let createCatalogTypeDto: any;

    beforeEach(() => {
      createCatalogTypeDto = {
        type: 'New type',
      };

      jest
        .spyOn(catalogTypeRepositoryMock, 'create')
        .mockResolvedValue(catalogTypeMock);
    });

    it('should call create', async () => {
      await service.createCatalogType(createCatalogTypeDto);

      expect(catalogTypeRepositoryMock.create).toHaveBeenCalledWith(
        createCatalogTypeDto
      );
    });

    it('should return transformed catalog type', async () => {
      expect(await service.createCatalogType(createCatalogTypeDto)).toEqual(
        catalogTypeMock
      );
    });
  });

  describe('getCatalogBrands', () => {
    beforeEach(() => {
      jest
        .spyOn(catalogBrandRepositoryMock, 'findAll')
        .mockResolvedValue([catalogBrandMock]);
    });

    it('should call findAll', async () => {
      await service.getCatalogBrands();

      expect(catalogBrandRepositoryMock.findAll).toHaveBeenCalled();
    });

    it('should return transformed catalog brands', async () => {
      expect(await service.getCatalogBrands()).toEqual([catalogBrandMock]);
    });
  });

  describe('updateCatalogBrand', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let updateCatalogBrandDto: any;

    beforeEach(() => {
      updateCatalogBrandDto = {
        brand: 'Updated',
      };

      jest
        .spyOn(catalogBrandRepositoryMock, 'findById')
        .mockResolvedValue(catalogBrandMock);
      jest
        .spyOn(catalogBrandRepositoryMock, 'update')
        .mockResolvedValue(catalogBrandMock);
    });

    it('should call findById', async () => {
      await service.updateCatalogBrand(
        catalogBrandMock.id,
        updateCatalogBrandDto
      );

      expect(catalogBrandRepositoryMock.findById).toHaveBeenCalledWith(
        catalogBrandMock.id
      );
    });

    it('should throw EntityNotFoundException', async () => {
      jest
        .spyOn(catalogBrandRepositoryMock, 'findById')
        .mockResolvedValueOnce(null);

      try {
        await service.updateCatalogBrand(
          catalogBrandMock.id,
          updateCatalogBrandDto
        );
      } catch (error) {
        expect(error).toBeInstanceOf(EntityNotFoundException);
      }
    });

    it('should transform updated brand', async () => {
      const updatedCatalogBrand = await service.updateCatalogBrand(
        catalogBrandMock.id,
        updateCatalogBrandDto
      );

      expect(updatedCatalogBrand).toEqual(catalogBrandMock);
    });
  });

  describe('createCatalogBrand', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let createCatalogBrandDto: any;

    beforeEach(() => {
      createCatalogBrandDto = {
        type: 'New brand',
      };

      jest
        .spyOn(catalogBrandRepositoryMock, 'create')
        .mockResolvedValue(catalogBrandMock);
    });

    it('should call create', async () => {
      await service.createCatalogBrand(createCatalogBrandDto);

      expect(catalogBrandRepositoryMock.create).toHaveBeenCalledWith(
        createCatalogBrandDto
      );
    });

    it('should return transformed catalog type', async () => {
      expect(await service.createCatalogBrand(createCatalogBrandDto)).toEqual(
        catalogBrandMock
      );
    });
  });
});
