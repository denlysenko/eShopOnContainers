import { ILogger } from '@e-shop-on-containers/logger';
import { OrderRepository } from '../../domain';
import { Result } from '../Result';
import { CommandHandler } from './CommandHandler';
import { SetPaidStatusCommand } from './SetPaidStatusCommand';

export class SetPaidStatusCommandHandler
  implements CommandHandler<SetPaidStatusCommand>
{
  constructor(
    private readonly _orderRepository: OrderRepository,
    private readonly _logger: ILogger
  ) {}

  public async handle(command: SetPaidStatusCommand): Promise<Result<void>> {
    this._logger.debug(
      `--- Handling command: ${SetPaidStatusCommand.name}: ${JSON.stringify(
        command
      )}`
    );

    const orderToUpdate = await this._orderRepository.getOrder(
      command.orderNumber
    );

    if (orderToUpdate === null) {
      this._logger.debug(
        `--- Command: ${SetPaidStatusCommand.name} handled - success: false`
      );

      return Result.fail<void>();
    }

    try {
      orderToUpdate.setPaidStatus();
      await this._orderRepository.updateOrder(orderToUpdate);
    } catch (error) {
      this._logger.error(
        `--- Command: ${
          SetPaidStatusCommand.name
        } was not handled - response: ${JSON.stringify(error)}`
      );

      return Result.fail<void>(error);
    }

    this._logger.debug(
      `--- Command: ${SetPaidStatusCommand.name} handled - success: true`
    );

    return Result.ok<void>();
  }
}
