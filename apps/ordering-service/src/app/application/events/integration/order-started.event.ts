import { IntegrationEvent } from '@e-shop-on-containers/event-bus';

export class OrderStartedEvent extends IntegrationEvent {
  public readonly name = OrderStartedEvent.name;

  constructor(public readonly userId: string) {
    super();
  }
}
