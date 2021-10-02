import { OutboxService } from './outbox.service';
import { eventBuClientMock } from './mocks/event-bus-client.mock';
import { outboxRepositoryMock } from './mocks/outbox-repository.mock';
import { ProductPriceChangedEvent } from '../events/product-price-changed.event';
import { catalogItemMock } from './mocks/catalog-item.mock';
import { MessageStatus } from '../constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loggerMock: any = {
  debug: jest.fn(),
};

describe('OutboxService', () => {
  let service: OutboxService;

  beforeEach(() => {
    service = new OutboxService(
      eventBuClientMock,
      outboxRepositoryMock,
      loggerMock
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('publishThroughEventBus', () => {
    let event: ProductPriceChangedEvent;

    beforeEach(() => {
      event = new ProductPriceChangedEvent(
        catalogItemMock.id,
        18,
        catalogItemMock.price
      );
    });

    describe('success', () => {
      it('should publish to event bus', async () => {
        await service.publishThroughEventBus(event);

        expect(eventBuClientMock.publish).toHaveBeenCalledWith(event);
      });

      it('should log', async () => {
        await service.publishThroughEventBus(event);

        expect(loggerMock.debug).toHaveBeenCalledWith(
          expect.stringContaining(event.id)
        );
      });

      it('should delete from repository', async () => {
        await service.publishThroughEventBus(event);

        expect(outboxRepositoryMock.delete).toHaveBeenCalledWith(event.id);
      });
    });

    describe('error', () => {
      beforeEach(() => {
        jest
          .spyOn(eventBuClientMock, 'publish')
          .mockRejectedValue({ error: 'Error' });
      });

      it('should update status in repository', async () => {
        await service.publishThroughEventBus(event);

        expect(outboxRepositoryMock.update).toHaveBeenCalledWith(
          event.id,
          expect.objectContaining({ status: MessageStatus.FAILED })
        );
      });

      it('should log', async () => {
        await service.publishThroughEventBus(event);

        expect(loggerMock.debug).toHaveBeenCalledWith(
          expect.stringContaining(event.id)
        );
      });
    });
  });
});
