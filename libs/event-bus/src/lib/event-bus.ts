import { IntegrationEvent } from './integration-event';

export interface EventBusClient {
  publish(event: IntegrationEvent): Promise<void>;
}

export const EVENT_BUS_CLIENT = Symbol('EventBusClient');
