import { plainToClass } from 'class-transformer';
import { CustomerBasketReadDto } from '..';
import { CustomerBasket } from '../../models';

export class BasketMapper {
  static toDto(basket: CustomerBasket): CustomerBasketReadDto {
    return plainToClass(CustomerBasketReadDto, basket, {
      excludeExtraneousValues: true,
    });
  }
}
