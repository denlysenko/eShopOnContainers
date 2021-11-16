/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderItem } from '../../domain';

export class OrderItemsMapper {
  static toPersistence(orderItem: OrderItem, orderId: number): any {
    return {
      id: orderItem.id,
      orderId,
      discount: orderItem.discount,
      productId: orderItem.productId,
      productName: orderItem.productName,
      unitPrice: orderItem.unitPrice,
      units: orderItem.units,
      pictureUrl: orderItem.pictureUrl,
    };
  }

  static toDomain(raw: any): OrderItem {
    return OrderItem.create({
      id: raw.id,
      productId: raw.productId,
      productName: raw.productName,
      pictureUrl: raw.pictureUrl,
      unitPrice: raw.unitPrice,
      discount: raw.discount,
      units: raw.units,
    });
  }
}
