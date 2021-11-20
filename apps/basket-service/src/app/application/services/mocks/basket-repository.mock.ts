import { BasketRepository } from '../../repositories/basket.repository';

export const basketRepositoryMock: BasketRepository = {
  getBasket: jest.fn(),
  updateBasket: jest.fn(),
  deleteBasket: jest.fn(),
  updateUnitPrice: jest.fn(),
};
