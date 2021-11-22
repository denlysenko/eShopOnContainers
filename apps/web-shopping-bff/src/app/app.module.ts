import { Module } from '@nestjs/common';
import { BasketModule } from './basket/basket.module';
import { CatalogModule } from './catalog/catalog.module';
import { HttpModule } from './http/http.module';

@Module({
  imports: [HttpModule, BasketModule, CatalogModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
