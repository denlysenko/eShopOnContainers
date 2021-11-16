import { Buyer } from './Buyer';
import { PaymentMethod } from './PaymentMethod';

describe('BuyerAggregate', () => {
  describe('Buyer', () => {
    describe('create', () => {
      it('success', () => {
        const identityGuid = '900d0582-8849-4de8-a9ec-d13f99f430a5';
        const name = 'Fake';
        const buyer = Buyer.create({ id: 1, identityGuid, name });

        expect(buyer).not.toBeNull();
      });

      it('fail', () => {
        const identityGuid = '';
        const name = 'Fake';

        try {
          Buyer.create({ id: 1, identityGuid, name });
        } catch (error) {
          expect(error.message).toBe('identityGuid cannot be empty');
        }
      });
    });

    describe('verifyOrAddPaymentMethod', () => {
      it('adds payment successfully', () => {
        const now = new Date();
        const cardTypeId = 1;
        const alias = 'fakeAlias';
        const cardNumber = '124';
        const cardSecurityNumber = '1234';
        const cardHolderName = 'FakeHolderNAme';
        const cardExpiration = new Date(
          now.getFullYear() + 1,
          now.getMonth(),
          now.getDate()
        );
        const orderId = 1;
        const name = 'fakeUser';
        const identityGuid = '900d0582-8849-4de8-a9ec-d13f99f430a5';
        const fakeBuyerItem = Buyer.create({ id: 1, identityGuid, name });

        const result = fakeBuyerItem.verifyOrAddPaymentMethod(
          {
            id: 1,
            cardTypeId,
            alias,
            cardNumber,
            cardSecurityNumber,
            cardHolderName,
            cardExpiration,
          },
          orderId
        );

        expect(result).not.toBeNull();
        expect(fakeBuyerItem.paymentMethods).toHaveLength(1);
      });

      it('raises new event', () => {
        const now = new Date();
        const cardTypeId = 1;
        const alias = 'fakeAlias';
        const cardNumber = '124';
        const cardSecurityNumber = '1234';
        const cardHolderName = 'FakeHolderNAme';
        const cardExpiration = new Date(
          now.getFullYear() + 1,
          now.getMonth(),
          now.getDate()
        );
        const orderId = 1;
        const name = 'fakeUser';
        const identityGuid = '900d0582-8849-4de8-a9ec-d13f99f430a5';
        const fakeBuyerItem = Buyer.create({ id: 1, identityGuid, name });

        fakeBuyerItem.verifyOrAddPaymentMethod(
          {
            id: 1,
            cardTypeId,
            alias,
            cardNumber,
            cardSecurityNumber,
            cardHolderName,
            cardExpiration,
          },
          orderId
        );

        expect(fakeBuyerItem.domainEvents).toHaveLength(1);
      });
    });
  });

  describe('PaymentMethod', () => {
    describe('create', () => {
      it('success', () => {
        const now = new Date();
        const cardTypeId = 1;
        const alias = 'fakeAlias';
        const cardNumber = '124';
        const cardSecurityNumber = '1234';
        const cardHolderName = 'FakeHolderNAme';
        const cardExpiration = new Date(
          now.getFullYear() + 1,
          now.getMonth(),
          now.getDate()
        );

        const result = PaymentMethod.create({
          id: 1,
          cardTypeId,
          alias,
          cardNumber,
          cardSecurityNumber,
          cardHolderName,
          cardExpiration,
        });

        expect(result).not.toBeNull();
      });

      it('fail due to expiration date', () => {
        const now = new Date();
        const cardTypeId = 1;
        const alias = 'fakeAlias';
        const cardNumber = '124';
        const cardSecurityNumber = '1234';
        const cardHolderName = 'FakeHolderNAme';
        const cardExpiration = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate()
        );

        try {
          PaymentMethod.create({
            id: 1,
            cardTypeId,
            alias,
            cardNumber,
            cardSecurityNumber,
            cardHolderName,
            cardExpiration,
          });
        } catch (error) {
          expect(error.message).toBe('Card is expired');
        }
      });
    });

    describe('isEqualTo', () => {
      it('returns true', () => {
        const now = new Date();
        const cardTypeId = 1;
        const alias = 'fakeAlias';
        const cardNumber = '124';
        const cardSecurityNumber = '1234';
        const cardHolderName = 'FakeHolderNAme';
        const cardExpiration = new Date(
          now.getFullYear() + 1,
          now.getMonth(),
          now.getDate()
        );

        const result = PaymentMethod.create({
          id: 1,
          cardTypeId,
          alias,
          cardNumber,
          cardSecurityNumber,
          cardHolderName,
          cardExpiration,
        });

        expect(
          result.isEqualTo(cardTypeId, cardNumber, cardExpiration)
        ).toBeTruthy();
      });

      it('returns false', () => {
        const now = new Date();
        const cardTypeId = 1;
        const alias = 'fakeAlias';
        const cardNumber = '124';
        const cardSecurityNumber = '1234';
        const cardHolderName = 'FakeHolderNAme';
        const cardExpiration = new Date(
          now.getFullYear() + 1,
          now.getMonth(),
          now.getDate()
        );

        const result = PaymentMethod.create({
          id: 1,
          cardTypeId,
          alias,
          cardNumber,
          cardSecurityNumber,
          cardHolderName,
          cardExpiration,
        });

        expect(result.isEqualTo(2, cardNumber, cardExpiration)).toBeFalsy();
      });
    });
  });
});
