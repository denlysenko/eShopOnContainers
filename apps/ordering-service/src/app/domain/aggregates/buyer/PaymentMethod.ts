import { Entity } from '../../Entity';
import { OrderingDomainException } from '../../exceptions/OrderingDomainException';
import { CardType } from './CardType';

export interface PaymentMethodProps {
  id: number;
  cardTypeId: number;
  cardNumber: string;
  cardSecurityNumber: string;
  cardHolderName: string;
  cardExpiration: Date;
  alias: string;
}

export class PaymentMethod extends Entity {
  private _alias: string;
  private _cardNumber: string;
  private _securityNumber: string;
  private _cardHolderName: string;
  private _expiration: Date;
  private _cardTypeId: number;
  private _cardType: CardType;

  public static create(props: PaymentMethodProps): PaymentMethod {
    if (props.cardNumber === null || props.cardNumber === undefined) {
      throw new OrderingDomainException(
        'CardNumber cannot be null or undefined'
      );
    }

    if (
      props.cardSecurityNumber === null ||
      props.cardSecurityNumber === undefined
    ) {
      throw new OrderingDomainException(
        'CardSecurityNumber cannot be null or undefined'
      );
    }

    if (props.cardHolderName === null || props.cardHolderName === undefined) {
      throw new OrderingDomainException(
        'CardholderName cannot be null or undefined'
      );
    }

    if (new Date(props.cardExpiration).getTime() < Date.now()) {
      throw new OrderingDomainException('Card is expired');
    }

    const paymentMethod = new PaymentMethod(props.id);

    paymentMethod._alias = props.alias;
    paymentMethod._cardNumber = props.cardNumber;
    paymentMethod._securityNumber = props.cardSecurityNumber;
    paymentMethod._cardHolderName = props.cardHolderName;
    paymentMethod._expiration = props.cardExpiration;
    paymentMethod._cardTypeId = props.cardTypeId;

    return paymentMethod;
  }

  private constructor(id: number) {
    super(id);
  }

  get cardHolderName(): string {
    return this._cardHolderName;
  }

  get alias(): string {
    return this._alias;
  }

  get cardNumber(): string {
    return this._cardNumber;
  }

  get cardSecurityNumber(): string {
    return this._securityNumber;
  }

  get expiration(): Date {
    return this._expiration;
  }

  get cardTypeId(): number {
    return this._cardTypeId;
  }

  public isEqualTo(
    cardTypeId: number,
    cardNumber: string,
    expiration: Date
  ): boolean {
    return (
      this._cardTypeId === cardTypeId &&
      this._cardNumber === cardNumber &&
      new Date(this._expiration).getTime() === new Date(expiration).getTime()
    );
  }
}
