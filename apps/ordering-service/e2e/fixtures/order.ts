import { buyer } from './buyer';
import { orderStatuses } from './order-statuses';
import { paymentMethod } from './payment-method';

export const order = {
  id: 1,
  street: 'Street',
  city: 'City',
  zipCode: '123456',
  country: 'Country',
  orderDate: '2021-10-10T12:40:20.288Z',
  paymentMethodId: paymentMethod.id,
  buyerId: buyer.id,
  orderStatusId: orderStatuses[3].id,
};
