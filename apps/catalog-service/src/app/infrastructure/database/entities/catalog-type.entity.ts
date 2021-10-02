import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CatalogItemEntity } from './catalog-item.entity';

@Entity({ name: 'catalog_type' })
export class CatalogTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @OneToMany(() => CatalogItemEntity, (item) => item.catalogType)
  catalogItems: CatalogItemEntity[];
}
