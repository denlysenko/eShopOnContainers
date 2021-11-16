import { ILogger } from '@e-shop-on-containers/logger';
import { OrderRepository } from '../../domain';
import { Result } from '../Result';
import { CommandHandler } from './CommandHandler';
import { ShipOrderCommand } from './ShipOrderCommand';

export class ShipOrderCommandHandler
  implements CommandHandler<ShipOrderCommand>
{
  constructor(
    private readonly _orderRepository: OrderRepository,
    private readonly _logger: ILogger
  ) {}

  public async handle(command: ShipOrderCommand): Promise<Result<void>> {
    this._logger.debug(
      `--- Handling command: ${ShipOrderCommand.name}: ${JSON.stringify(
        command
      )}`
    );

    const orderToUpdate = await this._orderRepository.getOrder(
      command.orderNumber
    );

    if (orderToUpdate === null) {
      this._logger.debug(
        `--- Command: ${ShipOrderCommand.name} handled - success: false`
      );

      return Result.fail<void>();
    }

    try {
      orderToUpdate.setShippedStatus();
      await this._orderRepository.updateOrder(orderToUpdate);
    } catch (error) {
      this._logger.error(
        `--- Command: ${ShipOrderCommand.name} was not handled - response: ${error}`
      );

      return Result.fail<void>(error);
    }

    this._logger.debug(
      `--- Command: ${ShipOrderCommand.name} handled - success: true`
    );

    return Result.ok<void>();
  }
}
