import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly _health: HealthCheckService,
    private readonly _http: HttpHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this._health.check([
      () =>
        this._http.pingCheck(
          'basket-service',
          `${process.env.BASKET_URL}/health`
        ),
      () =>
        this._http.pingCheck(
          'catalog-service',
          `${process.env.CATALOG_URL}/health`
        ),
      () =>
        this._http.pingCheck(
          'ordering-service',
          `${process.env.ORDERING_URL}/health`
        ),
      () =>
        this._http.pingCheck(
          'identity-service',
          process.env.KEYCLOAK_HEALTH_CHECK_URL
        ),
    ]);
  }
}
