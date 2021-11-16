/* eslint-disable @typescript-eslint/no-explicit-any */
import { Buyer } from '../../domain';
import { PaymentMethodsMapper } from '../mappers/payment-methods.mapper';

export class BuyerMapper {
  static toPersistence(buyer: Buyer): any {
    return {
      id: buyer.id,
      identityGuid: buyer.identityGuid,
      name: buyer.name,
    };
  }

  static toDomain(raw: any): Buyer {
    return Buyer.create({
      id: raw.id,
      identityGuid: raw.identityGuid,
      name: raw.name,
      paymentMethods: raw.paymentMethods.map((paymentMethod) =>
        PaymentMethodsMapper.toDomain(paymentMethod)
      ),
    });
  }
}
