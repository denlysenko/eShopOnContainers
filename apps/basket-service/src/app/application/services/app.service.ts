import { CustomerBasket } from '../../models';
import { BasketCheckoutDto } from '../dto/basket-checkout.dto';
import { BasketItemCreateDto } from '../dto/basket-item-create.dto';
import { CustomerBasketReadDto } from '../dto/customer-basket-read.dto';
import { UserCheckoutAcceptedEvent } from '../events/user-checkout-eccepted.event';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { BasketItemMapper } from '../mappers/basket-item.mapper';
import { BasketMapper } from '../mappers/basket.mapper';
import { BasketRepository } from '../repositories/basket.repository';
import { OutboxRepository } from '../repositories/outbox.repository';
import { UnitOfWork } from './unit-of-work';

export class AppService {
  constructor(
    private readonly _basketRepository: BasketRepository,
    private readonly _outboxRepository: OutboxRepository,
    private readonly _unitOfWork: UnitOfWork
  ) {}

  async getBasketById(customerId: string): Promise<CustomerBasketReadDto> {
    const basket = await this._basketRepository.getBasket(customerId);

    if (!basket) {
      return null;
    }

    return BasketMapper.toDto(basket);
  }

  async updateBasket(
    customerId: string,
    basketItemsDto: BasketItemCreateDto[]
  ): Promise<CustomerBasketReadDto> {
    const basketItems = basketItemsDto.map((item) =>
      BasketItemMapper.toModel(item)
    );
    const basket = new CustomerBasket(customerId, basketItems);

    await this._basketRepository.updateBasket(customerId, basket);

    return BasketMapper.toDto(basket);
  }

  async checkout(
    customerId: string,
    basketCheckout: BasketCheckoutDto
  ): Promise<void> {
    const basket = await this._basketRepository.getBasket(customerId);

    if (!basket) {
      throw new EntityNotFoundException(
        `Basket for customer ${customerId} not found`
      );
    }

    const event = new UserCheckoutAcceptedEvent(
      customerId,
      basketCheckout.buyer,
      basketCheckout.city,
      basketCheckout.street,
      basketCheckout.state,
      basketCheckout.country,
      basketCheckout.zipCode,
      basketCheckout.cardNumber,
      basketCheckout.cardHolderName,
      new Date(basketCheckout.cardExpiration),
      basketCheckout.cardSecurityNumber,
      basketCheckout.cardTypeId,
      basketCheckout.buyer,
      basket
    );

    await this._unitOfWork.withTransaction(async () => {
      await this._outboxRepository.create(event);
      await this._basketRepository.deleteBasket(customerId);
    });
  }

  async deleteBasket(customerId: string): Promise<void> {
    const basket = await this._basketRepository.getBasket(customerId);

    if (!basket) {
      throw new EntityNotFoundException(
        `Basket for customer ${customerId} not found`
      );
    }

    await this._basketRepository.deleteBasket(customerId);
  }
}
