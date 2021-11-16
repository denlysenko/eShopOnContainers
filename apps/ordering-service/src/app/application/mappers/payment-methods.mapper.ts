/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaymentMethod } from '../../domain';

export class PaymentMethodsMapper {
  static toPersistence(paymentMethod: PaymentMethod, buyerId: number): any {
    return {
      id: paymentMethod.id,
      cardHolderName: paymentMethod.cardHolderName,
      alias: paymentMethod.alias,
      cardNumber: paymentMethod.cardNumber,
      cardSecurityNumber: paymentMethod.cardSecurityNumber,
      expiration: paymentMethod.expiration,
      cardTypeId: paymentMethod.cardTypeId,
      buyerId,
    };
  }

  static toDomain(raw: any): PaymentMethod {
    return PaymentMethod.create({
      id: raw.id,
      cardTypeId: raw.cardTypeId,
      cardNumber: raw.cardNumber,
      cardHolderName: raw.cardHolderName,
      cardExpiration: raw.expiration,
      alias: raw.alias,
      cardSecurityNumber: raw.cardSecurityNumber,
    });
  }
}
