import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BasketItemReadDto } from '../dto/basket-item-read.dto';

export class CustomerBasketReadDto {
  @ApiProperty()
  @Expose()
  public buyerId: string;

  @ApiProperty({
    type: BasketItemReadDto,
    isArray: true,
  })
  @Expose()
  @Type(() => BasketItemReadDto)
  public basketItems: BasketItemReadDto[];
}
