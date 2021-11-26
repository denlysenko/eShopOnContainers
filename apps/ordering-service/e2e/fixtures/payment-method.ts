import { buyers } from './buyer';
import { cardTypes } from './card-types';

export const paymentMethod = {
  id: 1,
  cardHolderName: 'CardHolderName',
  cardNumber: '1111111111111',
  cardSecurityNumber: '123',
  expiration: '2024-10-10T12:40:20.288Z',
  cardTypeId: cardTypes[1].id,
  buyerId: buyers[0].id,
};
