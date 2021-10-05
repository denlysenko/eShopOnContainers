import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogTypeRepository } from '../../../application';
import { CatalogType } from '../../../models';
import { CatalogTypeEntity } from '../entities/catalog-type.entity';

export class DbCatalogTypeRepository implements CatalogTypeRepository {
  constructor(
    @InjectRepository(CatalogTypeEntity)
    private readonly _catalogTypeRepository: Repository<CatalogTypeEntity>
  ) {}

  findAll(): Promise<CatalogType[]> {
    return this._catalogTypeRepository.find();
  }

  findById(id: number): Promise<CatalogType> {
    return this._catalogTypeRepository.findOne(id);
  }

  async update(
    id: number,
    catalogType: Partial<CatalogType>
  ): Promise<CatalogType> {
    const { raw } = await this._catalogTypeRepository
      .createQueryBuilder()
      .update()
      .set(catalogType)
      .returning('*')
      .where('id = :id', { id })
      .execute();

    return raw[0];
  }

  async create(catalogType: Omit<CatalogType, 'id'>): Promise<CatalogType> {
    const { raw } = await this._catalogTypeRepository
      .createQueryBuilder()
      .insert()
      .values(catalogType)
      .returning('*')
      .execute();

    return raw[0];
  }
}
