import { ApiProperty } from '@nestjs/swagger';
import { BasketItemReadDto } from '../dto/basket-item-read.dto';

export class BasketReadDto {
  @ApiProperty()
  public buyerId: string;

  @ApiProperty({
    type: BasketItemReadDto,
    isArray: true,
  })
  public basketItems: BasketItemReadDto[];
}
