import { AggregateRoot } from '../../AggregateRoot';
import { BuyerAndPaymentMethodVerifiedDomainEvent } from '../../events/BuyerAndPaymentMethodVerifiedDomainEvent';
import { OrderingDomainException } from '../../exceptions/OrderingDomainException';
import { PaymentMethod, PaymentMethodProps } from './PaymentMethod';

interface BuyerProps {
  id: number;
  identityGuid: string;
  name: string;
  paymentMethods?: PaymentMethod[];
}

export class Buyer extends AggregateRoot {
  private _identityGuid: string;
  private _name: string;
  private _paymentMethods: PaymentMethod[];

  public static create(props: BuyerProps): Buyer {
    if (!props.identityGuid) {
      throw new OrderingDomainException('identityGuid cannot be empty');
    }

    if (!props.name) {
      throw new OrderingDomainException('name cannot be empty');
    }

    const buyer = new Buyer(props.id);

    buyer._identityGuid = props.identityGuid;
    buyer._name = props.name;
    buyer._paymentMethods = props.paymentMethods || [];

    return buyer;
  }

  private constructor(id: number) {
    super(id);
  }

  get identityGuid(): string {
    return this._identityGuid;
  }

  get name(): string {
    return this._name;
  }

  get paymentMethods(): PaymentMethod[] {
    return this._paymentMethods;
  }

  public verifyOrAddPaymentMethod(
    props: PaymentMethodProps,
    orderId: number
  ): PaymentMethod {
    const existingPayment = this._paymentMethods.find((paymentMethod) =>
      paymentMethod.isEqualTo(
        props.cardTypeId,
        props.cardNumber,
        props.cardExpiration
      )
    );

    if (existingPayment !== undefined) {
      this.addDomainEvent(
        new BuyerAndPaymentMethodVerifiedDomainEvent(
          this,
          existingPayment,
          orderId
        )
      );

      return existingPayment;
    }

    const payment = PaymentMethod.create(props);

    this._paymentMethods.push(payment);
    this.addDomainEvent(
      new BuyerAndPaymentMethodVerifiedDomainEvent(this, payment, orderId)
    );

    return payment;
  }
}
