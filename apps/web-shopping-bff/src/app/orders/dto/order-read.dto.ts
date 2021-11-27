import { ApiProperty } from '@nestjs/swagger';

export class OrderItemReadDto {
  @ApiProperty()
  public readonly productName: string;

  @ApiProperty()
  public readonly units: number;

  @ApiProperty()
  public readonly unitPrice: number;

  @ApiProperty()
  public readonly pictureUrl: string;
}

export class OrderReadDto {
  @ApiProperty()
  public readonly orderNumber: number;

  @ApiProperty()
  public readonly date: Date;

  @ApiProperty()
  public readonly status: string;

  @ApiProperty()
  public readonly description: string;

  @ApiProperty()
  public readonly street: string;

  @ApiProperty()
  public readonly city: string;

  @ApiProperty()
  public readonly zipCode: string;

  @ApiProperty()
  public readonly country: string;

  @ApiProperty()
  public readonly state: string;

  @ApiProperty({
    type: OrderItemReadDto,
    isArray: true,
  })
  public readonly orderItems: OrderItemReadDto[];
}
