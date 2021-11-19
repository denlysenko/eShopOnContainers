import { Expose, Type } from 'class-transformer';
import { BasketItem } from './basket-item.model';

export class CustomerBasket {
  @Expose()
  public buyerId: string;

  @Expose()
  @Type(() => BasketItem)
  public basketItems: BasketItem[];

  constructor(buyerId: string, basketItems: BasketItem[]) {
    this.buyerId = buyerId;
    this.basketItems = basketItems;
  }
}
