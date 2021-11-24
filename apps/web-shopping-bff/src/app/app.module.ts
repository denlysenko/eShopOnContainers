import { Module } from '@nestjs/common';
import { BasketModule } from './basket/basket.module';
import { CatalogModule } from './catalog/catalog.module';
import { HttpModule } from './http/http.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [HttpModule, BasketModule, CatalogModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
