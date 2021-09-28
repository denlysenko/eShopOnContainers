import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CatalogItemEntity } from './catalog-item.entity';

@Entity({ name: 'catalog_brand' })
export class CatalogBrandEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @OneToMany(() => CatalogItemEntity, (item) => item.catalogBrand)
  catalogItems: CatalogItemEntity[];
}
