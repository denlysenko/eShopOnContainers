import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CatalogTypeReadDto {
  @ApiProperty()
  @Expose()
  public readonly id: number;

  @ApiProperty()
  @Expose()
  public readonly type: string;
}
