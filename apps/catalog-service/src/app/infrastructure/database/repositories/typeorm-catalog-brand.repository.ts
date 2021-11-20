import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogBrandRepository } from '../../../application';
import { CatalogBrand } from '../../../models';
import { CatalogBrandEntity } from '../entities/catalog-brand.entity';

export class TypeOrmCatalogBrandRepository implements CatalogBrandRepository {
  constructor(
    @InjectRepository(CatalogBrandEntity)
    private readonly _catalogBrandRepository: Repository<CatalogBrandEntity>
  ) {}

  findAll(): Promise<CatalogBrand[]> {
    return this._catalogBrandRepository.find();
  }

  findById(id: number): Promise<CatalogBrand> {
    return this._catalogBrandRepository.findOne(id);
  }

  async update(
    id: number,
    catalogBrand: Partial<CatalogBrand>
  ): Promise<CatalogBrand> {
    const { raw } = await this._catalogBrandRepository
      .createQueryBuilder()
      .update()
      .set(catalogBrand)
      .returning('*')
      .where('id = :id', { id })
      .execute();

    return raw[0];
  }

  async create(catalogBrand: Omit<CatalogBrand, 'id'>): Promise<CatalogBrand> {
    const { raw } = await this._catalogBrandRepository
      .createQueryBuilder()
      .insert()
      .values(catalogBrand)
      .returning('*')
      .execute();

    return raw[0];
  }
}
