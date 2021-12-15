import { HttpModule as AxiosHttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { BasketModule } from './basket/basket.module';
import { CatalogModule } from './catalog/catalog.module';
import { HealthController } from './health.controller';
import { HttpModule } from './http/http.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    HttpModule,
    AxiosHttpModule,
    TerminusModule,
    BasketModule,
    CatalogModule,
    OrdersModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
