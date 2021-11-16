import { order } from './order';

export const orderItems = [
  {
    id: 1,
    orderId: order.id,
    productId: 12,
    productName: 'Product',
    unitPrice: 1.35,
    units: 2,
  },
  {
    id: 2,
    orderId: order.id,
    productId: 3,
    productName: 'Another Product',
    unitPrice: 3.12,
    units: 1,
  },
  {
    id: 3,
    orderId: order.id,
    productId: 24,
    productName: 'Yet Another Product',
    unitPrice: 3.24,
    units: 4,
  },
];
