import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { IBasketItem } from '../shared/models/basket-item.model';
import { BasketSharedService } from '../shared/services/basket-shared.service';

@Component({
  selector: 'esh-basket',
  styleUrls: ['./basket.component.scss'],
  templateUrl: './basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketComponent {
  private _basketItems: IBasketItem[] = [];
  private readonly _totalPrice = new BehaviorSubject<number>(0);

  errorMessages: any;

  public readonly totalPrice$ = this._totalPrice.asObservable();
  public readonly basketItems$ = this._basketSharedService.basketItems$.pipe(
    tap((items) => {
      this._basketItems = items;
      this._calculateTotalPrice();
    })
  );

  constructor(private readonly _basketSharedService: BasketSharedService) {}

  public itemQuantityChanged(item: IBasketItem) {
    this._calculateTotalPrice();
    this._basketSharedService.setBasket(this._basketItems).subscribe();
  }

  public update(event: any): void {
    this._basketSharedService
      .setBasket(this._basketItems)
      // TODO: add error handling
      .subscribe();
  }

  checkOut(event: any) {
    // this.update(event).subscribe((x) => {
    //   this.errorMessages = [];
    //   this.basketwrapper.basket = this.basket;
    //   this.router.navigate(['order']);
    // });
  }

  private _calculateTotalPrice() {
    let totalPrice = 0;

    this._basketItems.forEach((item) => {
      totalPrice += item.unitPrice * item.quantity;
    });

    this._totalPrice.next(totalPrice);
  }
}
