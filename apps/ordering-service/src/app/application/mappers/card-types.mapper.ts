import { plainToClass } from 'class-transformer';
import { CardTypeReadDto } from '../dto/card-type-read.dto';

export class CardTypesMapper {
  static toReadDto(cardType: unknown): CardTypeReadDto {
    return plainToClass(CardTypeReadDto, cardType, {
      excludeExtraneousValues: true,
    });
  }
}
