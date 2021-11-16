import { ILogger } from '@e-shop-on-containers/logger';
import { OrderRepository } from '../../domain';
import { Result } from '../Result';
import { CommandHandler } from './CommandHandler';
import { SetStockConfirmedStatusCommand } from './SetStockConfirmedStatusCommand';

export class SetStockConfirmedStatusCommandHandler
  implements CommandHandler<SetStockConfirmedStatusCommand>
{
  constructor(
    private readonly _orderRepository: OrderRepository,
    private readonly _logger: ILogger
  ) {}

  public async handle(
    command: SetStockConfirmedStatusCommand
  ): Promise<Result<void>> {
    this._logger.debug(
      `--- Handling command: ${
        SetStockConfirmedStatusCommand.name
      }: ${JSON.stringify(command)}`
    );

    const orderToUpdate = await this._orderRepository.getOrder(
      command.orderNumber
    );

    if (orderToUpdate === null) {
      this._logger.debug(
        `--- Command: ${SetStockConfirmedStatusCommand.name} handled - suucess: false`
      );

      return Result.fail<void>();
    }

    try {
      orderToUpdate.setStockConfirmedStatus();
      await this._orderRepository.updateOrder(orderToUpdate);
    } catch (error) {
      this._logger.error(
        `--- Command: ${
          SetStockConfirmedStatusCommand.name
        } was not handled - response: ${JSON.stringify(error)}`
      );

      return Result.fail<void>(error);
    }

    this._logger.debug(
      `--- Command: ${SetStockConfirmedStatusCommand.name} handled - success: true`
    );

    return Result.ok<void>();
  }
}
