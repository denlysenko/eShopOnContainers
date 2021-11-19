import { CustomerBasket } from '../../models';

export interface BasketRepository {
  getBasket(customerId: string): Promise<CustomerBasket>;
  updateBasket(
    customerId: string,
    basket: CustomerBasket
  ): Promise<CustomerBasket>;
  deleteBasket(customerId: string): Promise<void>;
  updateUnitPrice(productId: number, price: number): Promise<void>;
}

export const BASKET_REPOSITORY = Symbol('BasketRepository');
