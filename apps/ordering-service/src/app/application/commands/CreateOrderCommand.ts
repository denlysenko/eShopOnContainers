import {
  ArrayNotEmpty,
  IsNotEmpty,
  Length,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { OrderItemDto } from '../dto/order-item.dto';
import { BasketItemMapper } from '../mappers/basket-item.mapper';
import { BasketItem } from '../models/basket-item.model';

@ValidatorConstraint()
export class ValidExpirationDate implements ValidatorConstraintInterface {
  validate(propertyValue: Date) {
    return new Date(propertyValue).getTime() >= Date.now();
  }
}

export class CreateOrderCommand {
  @ArrayNotEmpty({ message: 'No order items found' })
  public readonly orderItems: OrderItemDto[];

  public readonly userId: string;
  public readonly userName: string;

  @IsNotEmpty({ message: 'No city found' })
  public readonly city: string;

  @IsNotEmpty({ message: 'No street found' })
  public readonly street: string;

  @IsNotEmpty({ message: 'No country found' })
  public readonly country: string;

  public readonly state: string;

  @IsNotEmpty({ message: 'No zipCode found' })
  public readonly zipCode: string;

  @IsNotEmpty({ message: 'No cardNumber found' })
  @Length(12, 19, { message: 'cardNumber length must be between 12 and 19' })
  public readonly cardNumber: string;

  @IsNotEmpty({ message: 'No cardHolderName found' })
  public readonly cardHolderName: string;

  @IsNotEmpty({ message: 'No cardExpiration found' })
  @Validate(ValidExpirationDate, {
    message: 'Please specify a valid card expiration date',
  })
  public readonly cardExpiration: Date;

  @IsNotEmpty({ message: 'No cardSecurityNumber found' })
  @Length(3, 3, {
    message: 'cardSecurityNumber length must be between 12 and 19',
  })
  public readonly cardSecurityNumber: string;

  @IsNotEmpty({ message: 'No cardTypeId found' })
  public readonly cardTypeId: number;

  constructor(
    basketItems: BasketItem[],
    userId: string,
    userName: string,
    city: string,
    street: string,
    state: string,
    country: string,
    zipCode: string,
    cardNumber: string,
    cardHolderName: string,
    cardExpiration: Date,
    cardSecurityNumber: string,
    cardTypeId: number
  ) {
    this.orderItems = basketItems.map((item) =>
      BasketItemMapper.toOrderItemDto(item)
    );
    this.userId = userId;
    this.userName = userName;
    this.city = city;
    this.street = street;
    this.state = state;
    this.country = country;
    this.zipCode = zipCode;
    this.cardNumber = cardNumber;
    this.cardHolderName = cardHolderName;
    this.cardExpiration = cardExpiration;
    this.cardSecurityNumber = cardSecurityNumber;
    this.cardTypeId = cardTypeId;
  }
}
