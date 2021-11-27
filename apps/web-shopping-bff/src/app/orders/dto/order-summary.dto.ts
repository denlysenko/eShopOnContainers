import { ApiProperty } from '@nestjs/swagger';

export class OrderSummaryDto {
  @ApiProperty()
  public readonly orderNumber: number;

  @ApiProperty()
  public readonly date: Date;

  @ApiProperty()
  public readonly status: string;

  @ApiProperty()
  public readonly total: number;
}
