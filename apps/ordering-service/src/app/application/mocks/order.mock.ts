export const orderMock = {
  id: 1,
  street: 'Street',
  city: 'City',
  zipCode: '123456',
  country: 'Country',
  orderDate: '2021-10-10T12:40:20.288Z',
  description: null,
  orderItems: [
    {
      productName: 'Product 1',
      units: 2,
      unitPrice: 1.25,
      pictureUrl: '',
    },
    {
      productName: 'Product 2',
      units: 1,
      unitPrice: 3.5,
      pictureUrl: '',
    },
  ],
  orderStatus: { name: 'New' },
};
