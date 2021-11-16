import { OrderingDomainException } from '../domain';

export class Result<T> {
  public success: boolean;
  public data: T | null;
  public error: any | null;

  constructor(success: boolean, data: T, error: OrderingDomainException) {
    this.success = success;
    this.data = data;
    this.error = error;
  }

  public static ok<U>(data?: U): Result<U> {
    return new Result<U>(true, data || null, null);
  }

  public static fail<U>(error?: any): Result<U> {
    return new Result<U>(false, null, error || null);
  }
}
