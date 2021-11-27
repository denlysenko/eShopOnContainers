import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrderDetail } from './models/order-detail.model';
import { OrdersService } from './orders.service';

@Component({
  selector: 'esh-orders',
  styleUrls: ['./orders.component.scss'],
  templateUrl: './orders.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent {
  errorReceived: boolean = false;

  public readonly orders$: Observable<IOrderDetail[]> =
    this._ordersService.getOrders();

  constructor(private readonly _ordersService: OrdersService) {}
}
