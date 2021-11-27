import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { OrdersDetailComponent } from './orders-detail/orders-detail.component';
import { OrdersComponent } from './orders.component';
import { OrdersService } from './orders.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: OrdersComponent,
      },
      {
        path: ':id',
        component: OrdersDetailComponent,
      },
    ]),
    SharedModule,
  ],
  declarations: [OrdersComponent, OrdersDetailComponent],
  providers: [OrdersService],
})
export class OrdersModule {}
