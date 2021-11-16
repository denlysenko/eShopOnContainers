import { OrderRepository } from '../../domain';
import { CardTypeReadDto } from '../dto/card-type-read.dto';
import { OrderReadDto } from '../dto/order-read.dto';
import { OrderSummaryDto } from '../dto/order-summary.dto';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { CardTypesMapper } from '../mappers/card-types.mapper';
import { OrdersMapper } from '../mappers/orders.mapper';

export class OrderQueries {
  constructor(private readonly _orderRepository: OrderRepository) {}

  async getOrder(id: number): Promise<OrderReadDto> {
    const order = await this._orderRepository.queryOrder(id);

    if (!order) {
      throw new EntityNotFoundException(`Order with id ${id} not found`);
    }

    return OrdersMapper.toOrderReadDto(order);
  }

  async getOrdersFromUser(userId: string): Promise<OrderSummaryDto[]> {
    const records = await this._orderRepository.queryOrdersFromUser(userId);

    return records.map((orderSummary) =>
      OrdersMapper.toOrderSummaryDto(orderSummary)
    );
  }

  async getCardTypes(): Promise<CardTypeReadDto[]> {
    const records = await this._orderRepository.queryCardTypes();

    return records.map((cardType) => CardTypesMapper.toReadDto(cardType));
  }
}
