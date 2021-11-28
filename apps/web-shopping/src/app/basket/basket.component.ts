import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, tap } from 'rxjs';
import { IBasketItem } from '../shared/models/basket-item.model';
import { BasketSharedService } from '../shared/services/basket-shared.service';
import { BasketService } from './basket.service';

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

  constructor(
    private readonly _basketSharedService: BasketSharedService,
    private readonly _modalService: NgbModal,
    private readonly _basketService: BasketService,
    private readonly _router: Router
  ) {}

  public itemQuantityChanged() {
    this._calculateTotalPrice();
    this._basketSharedService.setBasket(this._basketItems).subscribe();
  }

  public update(): void {
    this._basketSharedService.setBasket(this._basketItems).subscribe({
      error: (error) => {
        console.log(error);
      },
    });
  }

  checkOut() {
    // checkout through modal
    // const modalRef = this._modalService.open(CheckoutComponent, { size: 'lg' });

    // modalRef.componentInstance.basketItems = this._basketItems;
    // modalRef.result
    //   .then((result) => {
    //     this._basketService
    //       .checkout({
    //         ...result,
    //         cardExpiration: new Date(result.cardExpiration).toUTCString(),
    //       })
    //       .pipe(tap(() => this._basketSharedService.setBasketCheckedOut()))
    //       .subscribe({
    //         next: () => {
    //           // this.router.navigate(['order']);
    //         },
    //         error: (error) => {
    //           console.log(error);
    //         },
    //       });
    //   })
    //   .catch(() => {});

    // checkout through separate page
    this._router.navigate(['/basket/checkout']);
  }

  private _calculateTotalPrice() {
    let totalPrice = 0;

    this._basketItems.forEach((item) => {
      totalPrice += item.unitPrice * item.quantity;
    });

    this._totalPrice.next(totalPrice);
  }
}
