/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommandHandler } from '../commands/CommandHandler';
import { Result } from '../Result';

export class Mediator {
  private readonly _handlers = new Map<string, CommandHandler<any, any>>();

  public send<T, R = void>(command: T): Promise<Result<R>> {
    const commandName = this._getCommandName(command as any);
    const handler = this._handlers.get(commandName);

    if (!handler) {
      throw new Error(`Handler for command ${commandName} not registered`);
    }

    return handler.handle(command);
  }

  public register(handlers: CommandHandler<any, any>[]): void {
    handlers.forEach((handler) => {
      const { constructor } = Object.getPrototypeOf(handler);
      const name = constructor.name.replace('Handler', '');

      this._handlers.set(name, handler);
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private _getCommandName(command: Function): string {
    const { constructor } = Object.getPrototypeOf(command);
    return constructor.name as string;
  }
}
