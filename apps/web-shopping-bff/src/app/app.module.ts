import { Module } from '@nestjs/common';
import { BasketModule } from './basket/basket.module';
import { HttpModule } from './http/http.module';

@Module({
  imports: [HttpModule, BasketModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
