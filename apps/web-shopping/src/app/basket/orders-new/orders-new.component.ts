import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BasketSharedService } from '../../shared/services/basket-shared.service';
import { BasketService } from '../basket.service';

@Component({
  selector: 'esh-orders-new',
  styleUrls: ['./orders-new.component.scss'],
  templateUrl: './orders-new.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersNewComponent {
  private readonly _isOrderProcessing = new BehaviorSubject<boolean>(false);
  private readonly _errorReceived = new BehaviorSubject<boolean>(false);

  public total = 0;

  public readonly isOrderProcessing$: Observable<boolean> =
    this._isOrderProcessing.asObservable();
  public readonly errorReceived$: Observable<boolean> =
    this._errorReceived.asObservable();

  public readonly newOrderForm = this._fb.group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    country: ['', Validators.required],
    zipCode: ['', Validators.required],
    cardNumber: ['', Validators.required],
    cardHolderName: ['', Validators.required],
    expirationDate: ['', Validators.required],
    cardSecurityNumber: ['', Validators.required],
    cardTypeId: ['', Validators.required],
  });

  public readonly cardTypes$ = this._basketService.getCardTypes().pipe(
    tap((cardTypes) => {
      this.newOrderForm.patchValue({ cardTypeId: cardTypes[0].id });
    })
  );

  public readonly basketItems$ = this._basketSharedService.basketItems$.pipe(
    tap((basketItems) => {
      basketItems.forEach((item) => {
        this.total += item.quantity * item.unitPrice;
      });
    })
  );

  constructor(
    private readonly _basketSharedService: BasketSharedService,
    private readonly _basketService: BasketService,
    private readonly _fb: FormBuilder,
    private readonly _router: Router,
    private readonly _oidcSecurityService: OidcSecurityService
  ) {}

  submitForm() {
    this._errorReceived.next(false);
    this._isOrderProcessing.next(true);

    const cardExpiration = new Date(
      20 + this.newOrderForm.controls['expirationDate'].value.split('/')[1],
      this.newOrderForm.controls['expirationDate'].value.split('/')[0]
    ).toUTCString();

    const buyer = this._oidcSecurityService.getUserData().name;

    this._basketService
      .checkout({
        ...this.newOrderForm.value,
        cardExpiration,
        buyer,
      })
      .pipe(tap(() => this._basketSharedService.setBasketCheckedOut()))
      .subscribe({
        next: () => {
          this._router.navigate(['/orders']);
        },
        error: () => {
          this._errorReceived.next(true);
          this._isOrderProcessing.next(false);
        },
      });
  }
}
