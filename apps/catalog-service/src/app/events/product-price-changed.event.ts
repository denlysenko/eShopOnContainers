import { IntegrationEvent } from '@e-shop-on-containers/event-bus';

export class ProductPriceChangedEvent extends IntegrationEvent {
  public readonly name = ProductPriceChangedEvent.name;

  constructor(
    public readonly productId: number,
    public readonly newPrice: number,
    public readonly oldPrice: number
  ) {
    super();
  }
}
