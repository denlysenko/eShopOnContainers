import { plainToClass } from 'class-transformer';
import { BasketItem } from '../../models';
import { BasketItemCreateDto } from '../dto/basket-item-create.dto';

export class BasketItemMapper {
  static toModel(basketItemDto: BasketItemCreateDto): BasketItem {
    return plainToClass(BasketItem, basketItemDto, {
      excludeExtraneousValues: true,
    });
  }
}
