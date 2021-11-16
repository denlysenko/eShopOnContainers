/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer';
import { Address, Order } from '../../domain';
import { OrderReadDto } from '../dto/order-read.dto';
import { OrderSummaryDto } from '../dto/order-summary.dto';
import { OrderItemsMapper } from './order-items.mapper';

export class OrdersMapper {
  static toOrderSummaryDto(orderSummary: unknown) {
    return plainToClass(OrderSummaryDto, orderSummary, {
      excludeExtraneousValues: true,
    });
  }

  static toOrderReadDto(order: unknown) {
    return plainToClass(OrderReadDto, order, {
      excludeExtraneousValues: true,
    });
  }

  static toDomain(raw: any): Order {
    return Order.create({
      id: raw.id,
      orderDate: raw.orderDate,
      description: raw.description,
      address: Address.create({
        street: raw.street,
        city: raw.city,
        state: raw.state,
        country: raw.country,
        zipCode: raw.zipCode,
      }),
      buyerId: raw.buyerId,
      paymentMethodId: raw.paymentMethodId,
      orderStatusId: raw.orderStatusId,
      orderItems: (raw.orderItems || []).map((orderItemRaw) =>
        OrderItemsMapper.toDomain(orderItemRaw)
      ),
    });
  }

  static toPersistence(order: Order): any {
    return {
      id: order.id,
      street: order.address.street,
      city: order.address.city,
      state: order.address.state,
      zipCode: order.address.zipCode,
      country: order.address.country,
      orderDate: order.orderDate,
      description: order.description,
      paymentMethodId: order.paymentMethodId,
      buyerId: order.buyerId,
      orderStatusId: order.orderStatusId,
    };
  }
}
