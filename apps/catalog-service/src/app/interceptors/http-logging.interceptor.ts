import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';

export class HttpLoggingInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();

    const method = request.method;
    const url = request.url;

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        Logger.debug(
          `${response.statusCode} | [${method}] ${url} - ${delay}ms`
        );
      }),
      catchError((error) => {
        const delay = Date.now() - now;
        Logger.error(`${error.name} | [${method}] ${url} - ${delay}ms`);

        return throwError(() => error);
      })
    );
  }
}
