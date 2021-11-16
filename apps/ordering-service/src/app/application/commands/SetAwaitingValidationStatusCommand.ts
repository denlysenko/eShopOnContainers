import { IsNotEmpty } from 'class-validator';

export class SetAwaitingValidationStatusCommand {
  @IsNotEmpty({ message: 'No orderNumber found' })
  public readonly orderNumber: number;

  constructor(orderNumber: number) {
    this.orderNumber = orderNumber;
  }
}
