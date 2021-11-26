import { BuyerRepository } from '../../domain';

export const buyerRepositoryMock: BuyerRepository = {
  addBuyer: jest.fn(),
  updateBuyer: jest.fn(),
  findByIdentity: jest.fn(),
  findById: jest.fn(),
  nextBuyerId: jest.fn(),
  nextPaymentMethodId: jest.fn(),
  savePaymentMethods: jest.fn(),
};
