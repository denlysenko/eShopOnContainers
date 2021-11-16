import { OrderStartedDomainEvent } from '../../events/OrderStartedDomainEvent';
import { Address } from './Address';
import { Order } from './Order';
import { OrderItem } from './OrderItem';

describe('OrderAggregate', () => {
  describe('OrderItem', () => {
    describe('create', () => {
      it('success', () => {
        const id = 1;
        const productName = 'FakeProductName';
        const productId = 5;
        const unitPrice = 12;
        const discount = 15;
        const pictureUrl = 'FakeUrl';
        const units = 5;

        const fakeOrderItem = OrderItem.create({
          id,
          productName,
          productId,
          unitPrice,
          discount,
          pictureUrl,
          units,
        });

        expect(fakeOrderItem).not.toBeNull();
      });

      it('invalid number of units', () => {
        const id = 1;
        const productName = 'FakeProductName';
        const productId = 5;
        const unitPrice = 12;
        const discount = 15;
        const pictureUrl = 'FakeUrl';
        const units = -1;

        try {
          OrderItem.create({
            id,
            productId,
            productName,
            unitPrice,
            discount,
            pictureUrl,
            units,
          });
        } catch (error) {
          expect(error.message).toBe('Invalid number of units');
        }
      });

      it('invalid total of order item lower than discount applied', () => {
        const id = 1;
        const productName = 'FakeProductName';
        const productId = 5;
        const unitPrice = 12;
        const discount = 15;
        const pictureUrl = 'FakeUrl';
        const units = 1;

        try {
          OrderItem.create({
            id,
            productId,
            productName,
            unitPrice,
            discount,
            pictureUrl,
            units,
          });
        } catch (error) {
          expect(error.message).toBe(
            'The total of order item is lower than applied discount'
          );
        }
      });
    });

    describe('setNewDiscount', () => {
      it('invalid discount setting', () => {
        const id = 1;
        const productName = 'FakeProductName';
        const productId = 5;
        const unitPrice = 12;
        const discount = 15;
        const pictureUrl = 'FakeUrl';
        const units = 5;

        const fakeOrderItem = OrderItem.create({
          id,
          productId,
          productName,
          unitPrice,
          discount,
          pictureUrl,
          units,
        });

        try {
          fakeOrderItem.setNewDiscount(-1);
        } catch (error) {
          expect(error.message).toBe('Discount is not valid');
        }
      });
    });

    describe('addUnits', () => {
      it('invalid units setting', () => {
        const id = 1;
        const productName = 'FakeProductName';
        const productId = 5;
        const unitPrice = 12;
        const discount = 15;
        const pictureUrl = 'FakeUrl';
        const units = 5;

        const fakeOrderItem = OrderItem.create({
          id,
          productId,
          productName,
          unitPrice,
          discount,
          pictureUrl,
          units,
        });

        try {
          fakeOrderItem.addUnits(-1);
        } catch (error) {
          expect(error.message).toBe('Invalid units');
        }
      });
    });
  });

  describe('Order', () => {
    describe('addOrderItem', () => {
      it('when add two times on the same item, then the total of order should be the sum of the two items', () => {
        const address = Address.create({
          street: 'street',
          city: 'city',
          state: 'state',
          country: 'country',
          zipCode: 'zipcode',
        });

        const order = Order.create({
          id: 1,
          address,
          cardProps: {
            userId: 'userId',
            cardTypeId: 5,
            cardNumber: '12',
            cardSecurityNumber: '123',
            cardHolderName: 'name',
            cardExpiration: new Date(),
          },
        });

        order.addOrderItem({
          id: 1,
          productId: 5,
          productName: 'cup',
          unitPrice: 10,
          discount: 0,
          pictureUrl: '',
          units: 1,
        });

        order.addOrderItem({
          id: 1,
          productId: 5,
          productName: 'cup',
          unitPrice: 10,
          discount: 0,
          pictureUrl: '',
          units: 1,
        });

        expect(order.getTotal()).toBe(20);
      });

      it('add new Order raises new event', () => {
        const address = Address.create({
          street: 'street',
          city: 'city',
          state: 'state',
          country: 'country',
          zipCode: 'zipcode',
        });

        const order = Order.create({
          id: 1,
          address,
          cardProps: {
            userId: 'userId',
            cardTypeId: 5,
            cardNumber: '12',
            cardSecurityNumber: '123',
            cardHolderName: 'name',
            cardExpiration: new Date(),
          },
        });

        expect(order.domainEvents).toHaveLength(1);
      });
    });

    describe('removeDomainEvent', () => {
      it('removes  domain event', () => {
        const address = Address.create({
          street: 'street',
          city: 'city',
          state: 'state',
          country: 'country',
          zipCode: 'zipcode',
        });

        const userId = 'userId';
        const cardTypeId = 5;
        const cardNumber = '12';
        const cardSecurityNumber = '123';
        const cardHolderName = 'name';
        const cardExpiration = new Date();

        const order = Order.create({
          id: 1,
          address,
          cardProps: {
            userId,
            cardTypeId,
            cardNumber,
            cardSecurityNumber,
            cardHolderName,
            cardExpiration,
          },
        });

        const fakeEvent = new OrderStartedDomainEvent(
          order,
          userId,
          undefined,
          cardTypeId,
          cardNumber,
          cardSecurityNumber,
          cardHolderName,
          cardExpiration
        );

        order.addDomainEvent(fakeEvent);

        expect(order.domainEvents).toHaveLength(2);

        order.removeDomainEvent(fakeEvent);

        expect(order.domainEvents).toHaveLength(1);
      });
    });
  });
});
