import { Result } from '../Result';

export interface CommandHandler<T, R = void> {
  handle(command: T): Promise<Result<R>>;
}
