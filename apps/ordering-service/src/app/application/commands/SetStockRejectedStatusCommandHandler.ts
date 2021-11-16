import { ILogger } from '@e-shop-on-containers/logger';
import { OrderRepository } from '../../domain';
import { Result } from '../Result';
import { CommandHandler } from './CommandHandler';
import { SetStockRejectedStatusCommand } from './SetStockRejectedStatusCommand';

export class SetStockRejectedStatusCommandHandler
  implements CommandHandler<SetStockRejectedStatusCommand>
{
  constructor(
    private readonly _orderRepository: OrderRepository,
    private readonly _logger: ILogger
  ) {}

  public async handle(
    command: SetStockRejectedStatusCommand
  ): Promise<Result<void>> {
    this._logger.debug(
      `--- Handling command: ${
        SetStockRejectedStatusCommand.name
      }: ${JSON.stringify(command)}`
    );

    const orderToUpdate = await this._orderRepository.getOrder(
      command.orderNumber
    );

    if (orderToUpdate === null) {
      this._logger.debug(
        `--- Command: ${SetStockRejectedStatusCommand.name} handled - success: false`
      );

      return Result.fail<void>();
    }

    try {
      orderToUpdate.setCancelledStatusWhenStockIsRejected(command.orderItems);
      await this._orderRepository.updateOrder(orderToUpdate);
    } catch (error) {
      this._logger.error(
        `--- Command: ${
          SetStockRejectedStatusCommand.name
        } was not handled - response: ${JSON.stringify(error)}`
      );

      return Result.fail<void>(error);
    }

    this._logger.debug(
      `--- Command: ${SetStockRejectedStatusCommand.name} handled - response: true`
    );

    return Result.ok<void>();
  }
}
