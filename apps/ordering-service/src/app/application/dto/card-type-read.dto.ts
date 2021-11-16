import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CardTypeReadDto {
  @ApiProperty()
  @Expose()
  public readonly id: number;

  @ApiProperty()
  @Expose()
  public readonly name: string;
}
