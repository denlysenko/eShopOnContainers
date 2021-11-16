import { ILogger } from '@e-shop-on-containers/logger';
import { OrderRepository } from '../../domain';
import { Result } from '../Result';
import { CancelOrderCommand } from './CancelOrderCommand';
import { CommandHandler } from './CommandHandler';

export class CancelOrderCommandHandler
  implements CommandHandler<CancelOrderCommand>
{
  constructor(
    private readonly _orderRepository: OrderRepository,
    private readonly _logger: ILogger
  ) {}

  public async handle(command: CancelOrderCommand): Promise<Result<void>> {
    this._logger.debug(
      `--- Handling command: ${CancelOrderCommand.name}: ${JSON.stringify(
        command
      )}`
    );

    const orderToUpdate = await this._orderRepository.getOrder(
      command.orderNumber
    );

    if (orderToUpdate === null) {
      this._logger.debug(
        `--- Command: ${CancelOrderCommand.name} handled - success: false`
      );

      return Result.fail<void>();
    }

    try {
      orderToUpdate.setCancelledStatus();
      await this._orderRepository.updateOrder(orderToUpdate);
    } catch (error) {
      this._logger.error(
        `--- Command: ${CancelOrderCommand.name} was not handled - response: ${error}`
      );

      return Result.fail<void>(error);
    }

    this._logger.debug(
      `--- Command: ${CancelOrderCommand.name} handled - success: true`
    );

    return Result.ok<void>();
  }
}
