import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OrderSummaryDto {
  @ApiProperty()
  @Expose({ name: 'id' })
  public readonly orderNumber: number;

  @ApiProperty()
  @Expose({ name: 'orderDate' })
  public readonly date: Date;

  @ApiProperty()
  @Expose()
  public readonly status: string;

  @ApiProperty()
  @Expose()
  public readonly total: number;
}
