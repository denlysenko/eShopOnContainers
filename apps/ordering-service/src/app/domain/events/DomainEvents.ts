import { AggregateRoot } from '../AggregateRoot';
import { IDomainEvent } from './IDomainEvent';

type Callback = (event: IDomainEvent) => void;

export class DomainEvents {
  private static handlersMap = new Map<string, Callback[]>();
  private static markedAggregates: AggregateRoot[] = [];

  public static markAggregateForDispatch(aggregate: AggregateRoot): void {
    const found = this.findMarkedAggregateById(aggregate.id);

    if (found === null) {
      this.markedAggregates.push(aggregate);
    }
  }

  public static register(callback: Callback, eventClassName: string) {
    if (!this.handlersMap.has(eventClassName)) {
      this.handlersMap.set(eventClassName, [callback]);
    } else {
      this.handlersMap.get(eventClassName).push(callback);
    }
  }

  public static clearHandlers(): void {
    this.handlersMap.clear();
  }

  public static dispatchEventsForAggregate(id: number): void {
    const aggregate = this.findMarkedAggregateById(id);

    if (aggregate !== null) {
      aggregate.domainEvents.forEach((event) => this.dispatch(event));
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  private static findMarkedAggregateById(id: number): AggregateRoot | null {
    let found: AggregateRoot = null;

    for (const aggregate of this.markedAggregates) {
      if (aggregate.id === id) {
        found = aggregate;
      }
    }

    return found;
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot
  ): void {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));
    this.markedAggregates.splice(index, 1);
  }

  private static dispatch(event: IDomainEvent): void {
    const eventClassName = event.constructor.name;

    if (this.handlersMap.has(eventClassName)) {
      const handlers = this.handlersMap.get(eventClassName);

      for (const handler of handlers) {
        handler(event);
      }
    }
  }
}
