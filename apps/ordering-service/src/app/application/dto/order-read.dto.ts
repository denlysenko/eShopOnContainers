import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export class OrderItemReadDto {
  @ApiProperty()
  @Expose()
  public readonly productName: string;

  @ApiProperty()
  @Expose()
  public readonly units: number;

  @ApiProperty()
  @Expose()
  public readonly unitPrice: number;

  @ApiProperty()
  @Expose()
  public readonly pictureUrl: string;
}

export class OrderReadDto {
  @ApiProperty()
  @Expose({ name: 'id' })
  public readonly orderNumber: number;

  @ApiProperty()
  @Expose({ name: 'orderDate' })
  public readonly date: Date;

  @ApiProperty()
  @Expose({ name: 'orderStatus' })
  @Transform(({ obj }) => obj.orderStatus.name)
  public readonly status: string;

  @ApiProperty()
  @Expose()
  public readonly description: string;

  @ApiProperty()
  @Expose()
  public readonly street: string;

  @ApiProperty()
  @Expose()
  public readonly city: string;

  @ApiProperty()
  @Expose()
  public readonly zipCode: string;

  @ApiProperty()
  @Expose()
  public readonly country: string;

  @ApiProperty()
  @Expose()
  public readonly state: string;

  @ApiProperty({
    type: OrderItemReadDto,
    isArray: true,
  })
  @Expose()
  @Type(() => OrderItemReadDto)
  public readonly orderItems: OrderItemReadDto[];

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) =>
    obj.orderItems.reduce((acc: number, orderItem: OrderItemReadDto) => {
      acc += orderItem.unitPrice * orderItem.units;

      return acc;
    }, 0)
  )
  public readonly total: number;
}
