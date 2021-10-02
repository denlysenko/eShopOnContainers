import { EventBusClient } from '@e-shop-on-containers/event-bus';

export const eventBuClientMock: EventBusClient = {
  publish: jest.fn().mockResolvedValue(true),
};
