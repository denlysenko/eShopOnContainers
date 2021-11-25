import { BasketItem } from './basket-item.model';

export class CustomerBasket {
  constructor(public buyerId: number, public basketItems: BasketItem[]) {}
}
