import { randomUUID } from 'crypto';

export abstract class IntegrationEvent {
  public readonly id = randomUUID();
  public readonly creationDate = new Date().toUTCString();
  public abstract readonly name: string;
}
