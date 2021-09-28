import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CatalogBrandReadDto {
  @ApiProperty()
  @Expose()
  public readonly id: number;

  @ApiProperty()
  @Expose()
  public readonly brand: string;
}
