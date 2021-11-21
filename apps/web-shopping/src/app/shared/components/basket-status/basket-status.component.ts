import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { BasketSharedService } from '../../services/basket-shared.service';

@Component({
  selector: 'esh-basket-status',
  styleUrls: ['./basket-status.component.scss'],
  templateUrl: './basket-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketStatusComponent {
  badge$: Observable<number> = this._basketService.basketItems$.pipe(
    map((items) => items.length),
    shareReplay({ refCount: true })
  );

  constructor(private readonly _basketService: BasketSharedService) {}
}
