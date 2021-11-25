import { ApiProperty } from '@nestjs/swagger';
import { IsCreditCard, IsNotEmpty } from 'class-validator';

export class BasketCheckoutDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'city is required' })
  public readonly city: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'street is required' })
  public readonly street: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'state is required' })
  public readonly state: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'country is required' })
  public readonly country: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'zipCode is required' })
  public readonly zipCode: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'cardNumber is required' })
  @IsCreditCard({ message: 'cardNumber is invalid' })
  public readonly cardNumber: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'cardHolderName is required' })
  public readonly cardHolderName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'cardExpiration is required' })
  public readonly cardExpiration: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'cardSecurityNumber is required' })
  public readonly cardSecurityNumber: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'cardTypeId is required' })
  public readonly cardTypeId: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'buyer is required' })
  public readonly buyer: string;
}
