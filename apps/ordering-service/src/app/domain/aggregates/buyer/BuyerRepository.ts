import { Buyer } from './Buyer';
import { PaymentMethod } from './PaymentMethod';

export interface BuyerRepository {
  addBuyer(buyer: Buyer): Promise<Buyer>;
  updateBuyer(buyer: Buyer): Promise<Buyer>;
  findByIdentity(identityGuid: string): Promise<Buyer>;
  findById(id: number): Promise<Buyer>;
  nextBuyerId(): Promise<number>;
  nextPaymentMethodId(): Promise<number>;
  savePaymentMethods(
    paymentMethods: PaymentMethod[],
    buyerId: number
  ): Promise<void>;
}

export const BUYER_REPOSITORY = Symbol('BuyerRepository');
