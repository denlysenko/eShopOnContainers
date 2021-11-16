import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';
import { BasketItem } from '../models/basket-item.model';

export class CreateOrderDraftCommand {
  @IsNotEmpty({ message: 'No orderNumber found' })
  public buyerId: string;

  @ArrayNotEmpty({ message: 'No items found' })
  public items: BasketItem[];

  constructor(buyerId: string, items: BasketItem[]) {
    this.buyerId = buyerId;
    this.items = items;
  }
}
