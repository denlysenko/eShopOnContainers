import { ILogger } from '@e-shop-on-containers/logger';
import { Order } from '../../domain';
import { OrderDraftDto } from '../dto/order-draft.dto';
import { BasketItemMapper } from '../mappers/basket-item.mapper';
import { Result } from '../Result';
import { CommandHandler } from './CommandHandler';
import { CreateOrderDraftCommand } from './CreateOrderDraftCommand';

export class CreateOrderDraftCommandHandler
  implements CommandHandler<CreateOrderDraftCommand, OrderDraftDto>
{
  constructor(private readonly _logger: ILogger) {}

  public async handle(
    command: CreateOrderDraftCommand
  ): Promise<Result<OrderDraftDto>> {
    this._logger.debug(
      `--- Handling command: ${CreateOrderDraftCommand.name}: ${JSON.stringify(
        command
      )}`
    );

    const order = Order.newDraft();
    const orderItems = command.items.map((item) =>
      BasketItemMapper.toOrderItemDto(item)
    );

    for (const item of orderItems) {
      order.addOrderItem({
        id: undefined,
        productId: item.productId,
        productName: item.productName,
        pictureUrl: item.pictureUrl,
        unitPrice: item.unitPrice,
        discount: item.discount,
        units: item.units,
      });
    }

    this._logger.debug(
      `--- Command: ${CreateOrderDraftCommand.name} handled - success: true`
    );

    return Result.ok<OrderDraftDto>(OrderDraftDto.fromOrder(order));
  }
}
