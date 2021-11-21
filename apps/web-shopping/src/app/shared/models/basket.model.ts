import { IBasketItem } from './basket-item.model';

export interface IBasket {
  basketItems: IBasketItem[];
  buyerId: string;
}
