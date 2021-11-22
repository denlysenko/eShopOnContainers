import { ApiProperty } from '@nestjs/swagger';

export class CatalogBrandReadDto {
  @ApiProperty()
  public readonly id: number;

  @ApiProperty()
  public readonly brand: string;
}
