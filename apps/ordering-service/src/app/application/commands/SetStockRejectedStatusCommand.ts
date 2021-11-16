import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';

export class SetStockRejectedStatusCommand {
  @IsNotEmpty({ message: 'No orderNumber found' })
  public readonly orderNumber: number;

  @ArrayNotEmpty({ message: 'No orderItems found' })
  public readonly orderItems: number[];

  constructor(orderNumber: number, orderItems: number[]) {
    this.orderNumber = orderNumber;
    this.orderItems = orderItems;
  }
}
