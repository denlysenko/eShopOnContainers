import { IsNotEmpty } from 'class-validator';

export class SetPaidStatusCommand {
  @IsNotEmpty({ message: 'No orderNumber found' })
  public readonly orderNumber: number

  constructor(orderNumber: number) {
    this.orderNumber = orderNumber;
  }
}
