import { Connection } from 'typeorm';
import { paymentMethod } from '../fixtures/payment-method';

export async function seedPaymentMethods(
  connection: Connection
): Promise<void> {
  await connection
    .createQueryBuilder()
    .insert()
    .into('payment_methods')
    .values(paymentMethod)
    .execute();
}
