import { Order } from '../../domain';
import { OrderItemDto } from './order-item.dto';

export class OrderDraftDto {
  public orderItems: OrderItemDto[];
  public total: number;

  static fromOrder(order: Order): OrderDraftDto {
    const orderDraftDto = new OrderDraftDto();

    orderDraftDto.orderItems = order.orderItems.map((item) => {
      const orderItemDto = new OrderItemDto();
      orderItemDto.discount = item.discount;
      orderItemDto.productId = item.productId;
      orderItemDto.unitPrice = item.unitPrice;
      orderItemDto.pictureUrl = item.pictureUrl;
      orderItemDto.units = item.units;
      orderItemDto.productName = item.productName;

      return orderItemDto;
    });

    orderDraftDto.total = order.getTotal();

    return orderDraftDto;
  }
}
