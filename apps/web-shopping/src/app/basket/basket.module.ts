import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BasketComponent } from './basket.component';
import { BasketService } from './basket.service';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersNewComponent } from './orders-new/orders-new.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: BasketComponent,
      },
      {
        path: 'checkout',
        component: OrdersNewComponent,
      },
    ]),
    SharedModule,
  ],
  declarations: [BasketComponent, CheckoutComponent, OrdersNewComponent],
  providers: [BasketService],
})
export class BasketModule {}
