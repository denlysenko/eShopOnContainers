import { Connection, Raw, Repository } from 'typeorm';
import { CatalogBrandEntity } from './database/entities/catalog-brand.entity';
import { CatalogItemEntity } from './database/entities/catalog-item.entity';
import { CatalogTypeEntity } from './database/entities/catalog-type.entity';
import { OutboxEntity } from './database/entities/outbox.entity';
import { CatalogBrandCreateDto } from './dto/catalog-brand-create.dto';
import { CatalogBrandReadDto } from './dto/catalog-brand-read.dto';
import { CatalogItemCreateDto } from './dto/catalog-item-create.dto';
import { CatalogItemReadDto } from './dto/catalog-item-read.dto';
import { CatalogItemUpdateDto } from './dto/catalog-item-update.dto';
import { CatalogItemsReadDto } from './dto/catalog-items-read.dto';
import { CatalogTypeCreateDto } from './dto/catalog-type-create.dto';
import { CatalogTypeReadDto } from './dto/catalog-type-read.dto';
import { ProductPriceChangedEvent } from './events/product-price-changed.event';
import { EntityNotFoundException } from './exceptions/entity-not-found.exception';
import { CatalogBrandMapper } from './mappers/catalog-brand.mapper';
import { CatalogItemMapper } from './mappers/catalog-item.mapper';
import { CatalogTypeMapper } from './mappers/catalog-type.mapper';
import { OutboxService } from './outbox/outbox.service';

export class AppService {
  constructor(
    private readonly _catalogItemRepository: Repository<CatalogItemEntity>,
    private readonly _catalogTypeRepository: Repository<CatalogTypeEntity>,
    private readonly _catalogBrandRepository: Repository<CatalogBrandEntity>,
    private readonly _outboxRepository: Repository<OutboxEntity>,
    private readonly _connection: Connection,
    private readonly _outboxService: OutboxService
  ) {}

  async getItems(
    pageSize: number,
    pageIndex: number
  ): Promise<CatalogItemsReadDto> {
    const [data, count] = await this._catalogItemRepository.findAndCount({
      skip: pageSize * pageIndex,
      take: pageSize,
      order: {
        name: 'ASC',
      },
      relations: ['catalogBrand', 'catalogType'],
    });

    return CatalogItemMapper.toReadItemsDto({
      pageIndex,
      pageSize,
      count,
      data,
    });
  }

  async getItemById(id: number): Promise<CatalogItemReadDto> {
    const catalogItem = await this._catalogItemRepository.findOne({
      where: { id },
      relations: ['catalogBrand', 'catalogType'],
    });

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
    const [data, count] = await this._catalogItemRepository.findAndCount({
      skip: pageSize * pageIndex,
      take: pageSize,
      where: {
        name: Raw((alias) => `LOWER(${alias}) LIKE :name`, {
          name: `${name.toLowerCase()}%`,
        }),
      },
      order: {
        name: 'ASC',
      },
      relations: ['catalogBrand', 'catalogType'],
    });

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
    const [data, count] = await this._catalogItemRepository.findAndCount({
      skip: pageSize * pageIndex,
      take: pageSize,
      where: {
        catalogBrandId,
        catalogTypeId,
      },
      order: {
        name: 'ASC',
      },
      relations: ['catalogBrand', 'catalogType'],
    });

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
    const [data, count] = await this._catalogItemRepository.findAndCount({
      skip: pageSize * pageIndex,
      take: pageSize,
      where: {
        catalogBrandId,
      },
      order: {
        name: 'ASC',
      },
      relations: ['catalogBrand', 'catalogType'],
    });

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

      const outboxMessage = this._outboxRepository.create({
        id: event.id,
        payload: JSON.stringify(event),
      });

      await this._connection.manager.transaction(async (entityManager) => {
        await entityManager.update(
          CatalogItemEntity,
          { id },
          updateCatalogItemDto
        );
        await entityManager.insert(OutboxEntity, outboxMessage);
      });

      await this._outboxService.publishThroughEventBus(event);
    } else {
      await this._catalogItemRepository.update(id, updateCatalogItemDto);
    }

    return this.getItemById(id);
  }

  async createCatalogItem(
    createCatalogItemDto: CatalogItemCreateDto
  ): Promise<CatalogItemReadDto> {
    const catalogItem =
      this._catalogItemRepository.create(createCatalogItemDto);

    await this._catalogItemRepository.insert(catalogItem);

    return this.getItemById(catalogItem.id);
  }

  async deleteCatalogItem(id: number): Promise<void> {
    const catalogItem = await this._catalogItemRepository.findOne(id);

    if (!catalogItem) {
      throw new EntityNotFoundException(`Catalog Item with id ${id} not found`);
    }

    await this._catalogItemRepository.delete(id);
  }

  async getCatalogTypes(): Promise<CatalogTypeReadDto[]> {
    const catalogTypes = await this._catalogTypeRepository.find();

    return catalogTypes.map((type) => CatalogTypeMapper.toReadDto(type));
  }

  async updateCatalogType(
    id: number,
    catalogTypeDto: CatalogTypeCreateDto
  ): Promise<CatalogTypeReadDto> {
    const catalogType = await this._catalogTypeRepository.findOne(id);

    if (!catalogType) {
      throw new EntityNotFoundException(`Catalog Type with id ${id} not found`);
    }

    const { raw } = await this._catalogTypeRepository
      .createQueryBuilder()
      .update()
      .set(catalogTypeDto)
      .returning('*')
      .where('id = :id', { id })
      .execute();

    return CatalogTypeMapper.toReadDto(raw[0]);
  }

  async createCatalogType(
    catalogTypeDto: CatalogTypeCreateDto
  ): Promise<CatalogTypeReadDto> {
    const { raw } = await this._catalogTypeRepository
      .createQueryBuilder()
      .insert()
      .values(catalogTypeDto)
      .returning('*')
      .execute();

    return CatalogTypeMapper.toReadDto(raw[0]);
  }

  async deleteCatalogType(id: number): Promise<void> {
    const catalogType = await this._catalogTypeRepository.findOne(id);

    if (!catalogType) {
      throw new EntityNotFoundException(`Catalog Type with id ${id} not found`);
    }

    await this._catalogTypeRepository.delete(id);
  }

  async getCatalogBrands(): Promise<CatalogBrandReadDto[]> {
    const catalogBrands = await this._catalogBrandRepository.find();

    return catalogBrands.map((brand) => CatalogBrandMapper.toReadDto(brand));
  }

  async updateCatalogBrand(
    id: number,
    catalogBrandDto: CatalogBrandCreateDto
  ): Promise<CatalogBrandReadDto> {
    const catalogBrand = await this._catalogBrandRepository.findOne(id);

    if (!catalogBrand) {
      throw new EntityNotFoundException(
        `Catalog Brand with id ${id} not found`
      );
    }

    const { raw } = await this._catalogBrandRepository
      .createQueryBuilder()
      .update()
      .set(catalogBrandDto)
      .returning('*')
      .where('id = :id', { id })
      .execute();

    return CatalogBrandMapper.toReadDto(raw[0]);
  }

  async createCatalogBrand(
    catalogBrandDto: CatalogBrandCreateDto
  ): Promise<CatalogBrandReadDto> {
    const { raw } = await this._catalogBrandRepository
      .createQueryBuilder()
      .insert()
      .values(catalogBrandDto)
      .returning('*')
      .execute();

    return CatalogBrandMapper.toReadDto(raw[0]);
  }

  async deleteCatalogBrand(id: number): Promise<void> {
    const catalogBrand = await this._catalogBrandRepository.findOne(id);

    if (!catalogBrand) {
      throw new EntityNotFoundException(
        `Catalog Brand with id ${id} not found`
      );
    }

    await this._catalogBrandRepository.delete(id);
  }
}
