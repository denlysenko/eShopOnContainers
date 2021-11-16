import { plainToClass } from 'class-transformer';
import { BasketItemDto } from '../dto/basket-item.dto';
import { OrderItemDto } from '../dto/order-item.dto';
import { BasketItem } from '../models/basket-item.model';

export class BasketItemMapper {
  static toOrderItemDto(basketItem: BasketItem): OrderItemDto {
    return plainToClass(OrderItemDto, basketItem, {
      excludeExtraneousValues: true,
    });
  }

  static toModel(basketItemDto: BasketItemDto): BasketItem {
    return plainToClass(BasketItem, basketItemDto, {
      excludeExtraneousValues: true,
    });
  }
}
