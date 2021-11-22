import { ApiProperty } from '@nestjs/swagger';

export class CatalogTypeReadDto {
  @ApiProperty()
  public readonly id: number;

  @ApiProperty()
  public readonly type: string;
}
