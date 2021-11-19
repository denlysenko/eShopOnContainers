import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasketRepository } from '../../../application';
import { CustomerBasket } from '../../../models';
import { BasketItemEntity } from '../entities/basket-item.entity';

export class TypeOrmBasketRepository implements BasketRepository {
  constructor(
    @InjectRepository(BasketItemEntity)
    private readonly _basketItemRepository: Repository<BasketItemEntity>
  ) {}

  async updateUnitPrice(productId: number, price: number): Promise<void> {
    await this._basketItemRepository
      .createQueryBuilder('bi')
      .update()
      .set({
        oldUnitPrice: () => 'bi.unitPrice',
        unitPrice: price,
      })
      .where('productId = :productId', { productId })
      .execute();
  }

  async getBasket(customerId: string): Promise<CustomerBasket> {
    const basketItems = await this._basketItemRepository.find({
      where: { buyerId: customerId },
    });

    return new CustomerBasket(customerId, basketItems);
  }

  async updateBasket(
    customerId: string,
    basket: CustomerBasket
  ): Promise<CustomerBasket> {
    await this._basketItemRepository.delete({ buyerId: customerId });

    const basketItems = this._basketItemRepository.create(
      basket.basketItems.map((item) => ({ ...item, buyerId: customerId }))
    );

    const { raw } = await this._basketItemRepository.insert(basketItems);

    return new CustomerBasket(customerId, raw[0]);
  }

  async deleteBasket(customerId: string): Promise<void> {
    await this._basketItemRepository.delete({ buyerId: customerId });
  }
}
