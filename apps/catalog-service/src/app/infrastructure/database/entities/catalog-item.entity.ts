import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CatalogDomainException } from '../../../application';
import { CatalogBrandEntity } from './catalog-brand.entity';
import { CatalogTypeEntity } from './catalog-type.entity';

@Entity({ name: 'catalog_item' })
export class CatalogItemEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index('name-idx')
  name: string;

  @Column()
  description: string;

  @Column({ type: 'float' })
  price: number;

  @Column()
  pictureFileName: string;

  @Column({ nullable: true })
  pictureUri: string;

  @Column({ nullable: true })
  catalogTypeId: number;

  @ManyToOne(() => CatalogTypeEntity)
  catalogType: CatalogTypeEntity;

  @Column({ nullable: true })
  catalogBrandId: number;

  @ManyToOne(() => CatalogBrandEntity)
  catalogBrand: CatalogBrandEntity;

  @Column()
  availableStock: number;

  // Available stock at which we should reorder
  @Column({ nullable: true })
  restockThreshold: number;

  // Maximum number of units that can be in-stock at any time (due to physical/logistical constraints in warehouses)
  @Column({ nullable: true })
  maxStockThreshold: number;

  // True if item is on reorder
  @Column()
  onReorder: boolean;

  // Decrements the quantity of a particular item in inventory and ensures the restockThreshold hasn't
  // been breached. If so, a RestockRequest is generated in CheckThreshold.
  // If there is sufficient stock of an item, then the integer returned at the end of this call should be the same as quantityDesired.
  // In the event that there is not sufficient stock available, the method will remove whatever stock is available and return that quantity to the client.
  // In this case, it is the responsibility of the client to determine if the amount that is returned is the same as quantityDesired.
  // It is invalid to pass in a negative number.
  // Returns the number actually removed from stock.
  public async removeStock(quantityDesired: number): Promise<void> {
    if (this.availableStock === 0) {
      throw new CatalogDomainException(
        `Empty stock, product item ${this.name} is sold out`
      );
    }

    if (quantityDesired <= 0) {
      throw new CatalogDomainException(
        'Item units desired should be greater than zero'
      );
    }

    const removed = Math.min(quantityDesired, this.availableStock);

    this.availableStock -= removed;

    await this.save();
  }

  // Increments the quantity of a particular item in inventory.
  // Returns the quantity that has been added to stock
  public async addStock(quantity: number): Promise<void> {
    const original = this.availableStock;

    // The quantity that the client is trying to add to stock is greater than what can be physically accommodated in the Warehouse
    if (this.availableStock + quantity > this.maxStockThreshold) {
      // For now, this method only adds new units up maximum stock threshold. In an expanded version of this application, we
      //could include tracking for the remaining units and store information about overstock elsewhere.
      this.availableStock += this.maxStockThreshold - this.availableStock;
    } else {
      this.availableStock += quantity;
    }

    this.onReorder = false;
    this.availableStock -= original;

    await this.save();
  }
}
