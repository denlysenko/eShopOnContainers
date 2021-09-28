import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CatalogTypeCreateDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'type is required' })
  @MaxLength(100, { message: 'type must have maximum length of 100 symbols' })
  public readonly type: string;
}
