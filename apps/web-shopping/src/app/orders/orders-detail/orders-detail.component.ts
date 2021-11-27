import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { IOrderDetail } from '../models/order-detail.model';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'esh-orders_detail',
  styleUrls: ['./orders-detail.component.scss'],
  templateUrl: './orders-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersDetailComponent {
  public readonly order$: Observable<IOrderDetail> = this._route.params.pipe(
    switchMap((params) =>
      this._ordersService.getOrder(parseInt(params['id'], 10))
    )
  );

  constructor(
    private readonly _ordersService: OrdersService,
    private readonly _route: ActivatedRoute
  ) {}
}
