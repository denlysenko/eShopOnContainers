import { IntegrationEvent } from '@e-shop-on-containers/event-bus';

export class GracePeriodConfirmedEvent extends IntegrationEvent {
  public readonly name = GracePeriodConfirmedEvent.name;

  constructor(public readonly orderId: number) {
    super();
  }
}
