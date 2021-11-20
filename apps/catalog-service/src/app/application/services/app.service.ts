import { CatalogBrandCreateDto } from '../dto/catalog-brand-create.dto';
import { CatalogBrandReadDto } from '../dto/catalog-brand-read.dto';
import { CatalogItemCreateDto } from '../dto/catalog-item-create.dto';
import { CatalogItemReadDto } from '../dto/catalog-item-read.dto';
import { CatalogItemUpdateDto } from '../dto/catalog-item-update.dto';
import { CatalogItemsReadDto } from '../dto/catalog-items-read.dto';
import { CatalogTypeCreateDto } from '../dto/catalog-type-create.dto';
import { CatalogTypeReadDto } from '../dto/catalog-type-read.dto';
import { ProductPriceChangedEvent } from '../events/product-price-changed.event';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { CatalogBrandMapper } from '../mappers/catalog-brand.mapper';
import { CatalogItemMapper } from '../mappers/catalog-item.mapper';
import { CatalogTypeMapper } from '../mappers/catalog-type.mapper';
import { CatalogBrandRepository } from '../repositories/catalog-brand.repository';
import { CatalogItemRepository } from '../repositories/catalog-item.repository';
import { CatalogTypeRepository } from '../repositories/catalog-type.repository';
import { OutboxRepository } from '../repositories/outbox.repository';
import { UnitOfWork } from '../services/unit-of-work';

export class AppService {
  constructor(
    private readonly _catalogItemRepository: CatalogItemRepository,
    private readonly _catalogTypeRepository: CatalogTypeRepository,
    private readonly _catalogBrandRepository: CatalogBrandRepository,
    private readonly _outboxRepository: OutboxRepository,
    private readonly _unitOfWork: UnitOfWork
  ) {}

  async getItems(
    pageSize: number,
    pageIndex: number
  ): Promise<CatalogItemsReadDto> {
    const [data, count] = await this._catalogItemRepository.findAll(
      pageSize * pageIndex,
      pageSize
    );

    return CatalogItemMapper.toReadItemsDto({
      pageIndex,
      pageSize,
      count,
      data,
    });
  }

  async getItemById(id: number): Promise<CatalogItemReadDto> {
    const catalogItem = await this._catalogItemRepository.findById(id);

    if (!catalogItem) {
      throw new EntityNotFoundException(`Catalog Item with id ${id} not found`);
    }

    return CatalogItemMapper.toReadItemDto(catalogItem);
  }

  async getItemsByName(
    name: string,
    pageSize: number,
    pageIndex: number
  ): Promise<CatalogItemsReadDto> {
    const [data, count] = await this._catalogItemRepository.findAllByName(
      name,
      pageSize * pageIndex,
      pageSize
    );

    return CatalogItemMapper.toReadItemsDto({
      pageIndex,
      pageSize,
      count,
      data,
    });
  }

  async getItemsByTypeIdAndBrandId(
    catalogTypeId: number,
    catalogBrandId: number,
    pageSize: number,
    pageIndex: number
  ): Promise<CatalogItemsReadDto> {
    const [data, count] =
      await this._catalogItemRepository.findAllByTypeAndBrand(
        catalogTypeId,
        catalogBrandId,
        pageSize * pageIndex,
        pageSize
      );

    return CatalogItemMapper.toReadItemsDto({
      pageIndex,
      pageSize,
      count,
      data,
    });
  }

  async getItemsByBrandId(
    catalogBrandId: number,
    pageSize: number,
    pageIndex: number
  ): Promise<CatalogItemsReadDto> {
    const [data, count] = await this._catalogItemRepository.findAllByBrand(
      catalogBrandId,
      pageSize * pageIndex,
      pageSize
    );

    return CatalogItemMapper.toReadItemsDto({
      pageIndex,
      pageSize,
      count,
      data,
    });
  }

  async updateCatalogItem(
    id: number,
    updateCatalogItemDto: CatalogItemUpdateDto
  ): Promise<CatalogItemReadDto> {
    const catalogItem = await this._catalogItemRepository.findOne(id);

    if (!catalogItem) {
      throw new EntityNotFoundException(`Catalog Item with id ${id} not found`);
    }

    const oldPrice = catalogItem.price;
    const raiseProductPriceChangedEvent =
      updateCatalogItemDto.price && oldPrice !== updateCatalogItemDto.price;

    if (raiseProductPriceChangedEvent) {
      const event = new ProductPriceChangedEvent(
        catalogItem.id,
        updateCatalogItemDto.price,
        catalogItem.price
      );

      await this._unitOfWork.withTransaction(async () => {
        await this._catalogItemRepository.update(id, updateCatalogItemDto);
        await this._outboxRepository.create({
          id: event.id,
          payload: JSON.stringify(event),
        });
      });
    } else {
      await this._catalogItemRepository.update(id, updateCatalogItemDto);
    }

    return this.getItemById(id);
  }

  async createCatalogItem(
    createCatalogItemDto: CatalogItemCreateDto
  ): Promise<CatalogItemReadDto> {
    const { id } = await this._catalogItemRepository.create(
      createCatalogItemDto
    );

    return this.getItemById(id);
  }

  async deleteCatalogItem(id: number): Promise<void> {
    const catalogItem = await this._catalogItemRepository.findOne(id);

    if (!catalogItem) {
      throw new EntityNotFoundException(`Catalog Item with id ${id} not found`);
    }

    await this._catalogItemRepository.delete(id);
  }

  async getCatalogTypes(): Promise<CatalogTypeReadDto[]> {
    const catalogTypes = await this._catalogTypeRepository.findAll();

    return catalogTypes.map((type) => CatalogTypeMapper.toReadDto(type));
  }

  async updateCatalogType(
    id: number,
    catalogTypeDto: CatalogTypeCreateDto
  ): Promise<CatalogTypeReadDto> {
    const catalogType = await this._catalogTypeRepository.findById(id);

    if (!catalogType) {
      throw new EntityNotFoundException(`Catalog Type with id ${id} not found`);
    }

    const updatedCatalogType = await this._catalogTypeRepository.update(
      id,
      catalogTypeDto
    );

    return CatalogTypeMapper.toReadDto(updatedCatalogType);
  }

  async createCatalogType(
    catalogTypeDto: CatalogTypeCreateDto
  ): Promise<CatalogTypeReadDto> {
    const createdCatalogType = await this._catalogTypeRepository.create(
      catalogTypeDto
    );

    return CatalogTypeMapper.toReadDto(createdCatalogType);
  }

  async getCatalogBrands(): Promise<CatalogBrandReadDto[]> {
    const catalogBrands = await this._catalogBrandRepository.findAll();

    return catalogBrands.map((brand) => CatalogBrandMapper.toReadDto(brand));
  }

  async updateCatalogBrand(
    id: number,
    catalogBrandDto: CatalogBrandCreateDto
  ): Promise<CatalogBrandReadDto> {
    const catalogBrand = await this._catalogBrandRepository.findById(id);

    if (!catalogBrand) {
      throw new EntityNotFoundException(
        `Catalog Brand with id ${id} not found`
      );
    }

    const updatedCatalogBrand = await this._catalogBrandRepository.update(
      id,
      catalogBrandDto
    );

    return CatalogBrandMapper.toReadDto(updatedCatalogBrand);
  }

  async createCatalogBrand(
    catalogBrandDto: CatalogBrandCreateDto
  ): Promise<CatalogBrandReadDto> {
    const createdCatalogBrand = await this._catalogBrandRepository.create(
      catalogBrandDto
    );

    return CatalogBrandMapper.toReadDto(createdCatalogBrand);
  }
}
