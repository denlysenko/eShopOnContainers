import { ILogger } from '@e-shop-on-containers/logger';
import { Address, Order, OrderRepository, UnitOfWork } from '../../domain';
import { OrderStartedEvent } from '../events/integration/order-started.event';
import { OutboxRepository } from '../repositories/outbox.repository';
import { Result } from '../Result';
import { CommandHandler } from './CommandHandler';
import { CreateOrderCommand } from './CreateOrderCommand';

export class CreateOrderCommandHandler
  implements CommandHandler<CreateOrderCommand>
{
  constructor(
    private readonly _orderRepository: OrderRepository,
    private readonly _outboxRepository: OutboxRepository,
    private readonly _unitOfWork: UnitOfWork,
    private readonly _logger: ILogger
  ) {}

  public async handle(command: CreateOrderCommand): Promise<Result<void>> {
    this._logger.debug(
      `--- Handling command: ${CreateOrderCommand.name}: ${JSON.stringify(
        command
      )}`
    );

    const address = Address.create({
      street: command.street,
      city: command.city,
      state: command.state,
      country: command.country,
      zipCode: command.zipCode,
    });

    const id = await this._orderRepository.nextOrderId();

    const order = Order.create({
      id,
      address,
      cardProps: {
        cardTypeId: command.cardTypeId,
        cardNumber: command.cardNumber,
        cardSecurityNumber: command.cardSecurityNumber,
        cardHolderName: command.cardNumber,
        cardExpiration: command.cardExpiration,
        userId: command.userId,
        userName: command.userName,
      },
    });

    for (const item of command.orderItems) {
      const id = await this._orderRepository.nextOrderItemId();

      order.addOrderItem({
        id,
        productId: item.productId,
        productName: item.productName,
        pictureUrl: item.pictureUrl,
        unitPrice: item.unitPrice,
        discount: item.discount,
        units: item.units,
      });
    }

    this._logger.debug(`--- Order created: ${JSON.stringify(order)}`);

    try {
      const orderStartedEvent = new OrderStartedEvent(command.userId);

      await this._unitOfWork.withTransaction(async () => {
        await this._orderRepository.addOrder(order);
        await this._outboxRepository.create({
          id: orderStartedEvent.id,
          payload: JSON.stringify(orderStartedEvent),
        });
      });
    } catch (error) {
      console.log(error);
      this._logger.debug(
        `--- Command: ${CreateOrderCommand.name} was not handled - response: ${error}`
      );

      return Result.fail<void>(error);
    }

    this._logger.debug(
      `--- Command: ${CreateOrderCommand.name} handled - success: true`
    );

    return Result.ok<void>();
  }
}
