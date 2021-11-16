import { Entity } from './Entity';
import { DomainEvents } from './events/DomainEvents';
import { IDomainEvent } from './events/IDomainEvent';

export abstract class AggregateRoot extends Entity {
  private _domainEvents: IDomainEvent[] = [];

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  public addDomainEvent(domainEvent: IDomainEvent): void {
    this._domainEvents.push(domainEvent);
    DomainEvents.markAggregateForDispatch(this);
  }

  public removeDomainEvent(domainEvent: IDomainEvent): void {
    const index = this._domainEvents.indexOf(domainEvent);

    if (index === -1) {
      return;
    }

    this._domainEvents.splice(index, 1);
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }
}
