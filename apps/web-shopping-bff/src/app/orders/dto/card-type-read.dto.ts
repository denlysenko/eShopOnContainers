import { ApiProperty } from '@nestjs/swagger';

export class CardTypeReadDto {
  @ApiProperty()
  public readonly id: number;

  @ApiProperty()
  public readonly name: string;
}
