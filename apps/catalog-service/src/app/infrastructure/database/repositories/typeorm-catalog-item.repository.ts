import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogItemRepository } from '../../../application';
import { CatalogItem } from '../../../models';
import { CatalogItemEntity } from '../entities/catalog-item.entity';

export class TypeOrmCatalogItemRepository implements CatalogItemRepository {
  constructor(
    @InjectRepository(CatalogItemEntity)
    private readonly _catalogItemRepository: Repository<CatalogItemEntity>
  ) {}

  async findAll(skip: number, take: number): Promise<[CatalogItem[], number]> {
    const queryBuilder =
      this._catalogItemRepository.createQueryBuilder('catalogItem');

    const count = await queryBuilder.getCount();

    const data = await queryBuilder
      .leftJoinAndSelect('catalogItem.catalogBrand', 'catalogBrand')
      .leftJoinAndSelect('catalogItem.catalogType', 'catalogType')
      .orderBy('catalogItem.name', 'ASC')
      .skip(skip)
      .take(take)
      .getMany();

    return [data, count];
  }

  findById(id: number): Promise<CatalogItem> {
    return this._catalogItemRepository.findOne(id, {
      relations: ['catalogBrand', 'catalogType'],
    });
  }

  findOne(id: number): Promise<CatalogItem> {
    return this._catalogItemRepository.findOne(id);
  }

  async findAllByName(
    name: string,
    skip: number,
    take: number
  ): Promise<[CatalogItem[], number]> {
    const queryBuilder =
      this._catalogItemRepository.createQueryBuilder('catalogItem');

    const count = await queryBuilder
      .where('LOWER(catalogItem.name) like :name', {
        name: `${name.toLowerCase()}%`,
      })
      .getCount();

    const data = await queryBuilder
      .where('LOWER(catalogItem.name) like :name', {
        name: `${name.toLowerCase()}%`,
      })
      .leftJoinAndSelect('catalogItem.catalogBrand', 'catalogBrand')
      .leftJoinAndSelect('catalogItem.catalogType', 'catalogType')
      .orderBy('catalogItem.name', 'ASC')
      .skip(skip)
      .take(take)
      .getMany();

    return [data, count];
  }

  async findAllByTypeAndBrand(
    catalogTypeId: number,
    catalogBrandId: number,
    skip: number,
    take: number
  ): Promise<[CatalogItem[], number]> {
    const queryBuilder =
      this._catalogItemRepository.createQueryBuilder('catalogItem');

    const count = await queryBuilder
      .where('catalogItem.catalogBrandId = :catalogBrandId', { catalogBrandId })
      .andWhere('catalogItem.catalogTypeId = :catalogTypeId', { catalogTypeId })
      .getCount();

    const data = await queryBuilder
      .where('catalogItem.catalogBrandId = :catalogBrandId', { catalogBrandId })
      .andWhere('catalogItem.catalogTypeId = :catalogTypeId', { catalogTypeId })
      .leftJoinAndSelect('catalogItem.catalogBrand', 'catalogBrand')
      .leftJoinAndSelect('catalogItem.catalogType', 'catalogType')
      .orderBy('catalogItem.name', 'ASC')
      .skip(skip)
      .take(take)
      .getMany();

    return [data, count];
  }

  async findAllByBrand(
    catalogBrandId: number,
    skip: number,
    take: number
  ): Promise<[CatalogItem[], number]> {
    const queryBuilder =
      this._catalogItemRepository.createQueryBuilder('catalogItem');

    const count = await queryBuilder
      .where('catalogItem.catalogBrandId = :catalogBrandId', { catalogBrandId })
      .getCount();

    const data = await queryBuilder
      .where('catalogItem.catalogBrandId = :catalogBrandId', { catalogBrandId })
      .leftJoinAndSelect('catalogItem.catalogBrand', 'catalogBrand')
      .leftJoinAndSelect('catalogItem.catalogType', 'catalogType')
      .orderBy('catalogItem.name', 'ASC')
      .skip(skip)
      .take(take)
      .getMany();

    return [data, count];
  }

  async findAllByType(
    catalogTypeId: number,
    skip: number,
    take: number
  ): Promise<[CatalogItem[], number]> {
    const queryBuilder =
      this._catalogItemRepository.createQueryBuilder('catalogItem');

    const count = await queryBuilder
      .where('catalogItem.catalogTypeId = :catalogTypeId', { catalogTypeId })
      .getCount();

    const data = await queryBuilder
      .where('catalogItem.catalogTypeId = :catalogTypeId', { catalogTypeId })
      .leftJoinAndSelect('catalogItem.catalogType', 'catalogType')
      .leftJoinAndSelect('catalogItem.catalogBrand', 'catalogBrand')
      .orderBy('catalogItem.name', 'ASC')
      .skip(skip)
      .take(take)
      .getMany();

    return [data, count];
  }

  async update(id: number, catalogItem: Partial<CatalogItem>): Promise<void> {
    await this._catalogItemRepository.update(id, catalogItem);
  }

  async create(catalogItem: CatalogItem): Promise<{ id: number }> {
    const createdCatalogItem = this._catalogItemRepository.create(catalogItem);
    await this._catalogItemRepository.insert(createdCatalogItem);

    return { id: createdCatalogItem.id };
  }

  async delete(id: number): Promise<void> {
    await this._catalogItemRepository.delete(id);
  }
}
