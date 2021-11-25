import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { tap } from 'rxjs';
import { IBasketItem } from '../../shared/models/basket-item.model';
import { BasketService } from '../basket.service';

@Component({
  selector: 'esh-checkout',
  styleUrls: ['./checkout.component.scss'],
  templateUrl: './checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent {
  public total: number = 0;

  public readonly form = this._fb.group({
    buyer: ['', Validators.required],
    city: ['', Validators.required],
    street: ['', Validators.required],
    state: ['', Validators.required],
    country: ['', Validators.required],
    zipCode: ['', Validators.required],
    cardTypeId: ['', Validators.required],
    cardNumber: ['', Validators.required],
    cardHolderName: ['', Validators.required],
    cardExpiration: ['', Validators.required],
    cardSecurityNumber: ['', Validators.required],
  });

  public readonly cardTypes$ = this._basketService.getCardTypes().pipe(
    tap((cardTypes) => {
      this.form.patchValue({ cardTypeId: cardTypes[0].id });
    })
  );

  @Input()
  set basketItems(basketItems: IBasketItem[]) {
    this._basketItems = basketItems;

    basketItems.forEach((item) => {
      this.total += item.quantity * item.unitPrice;
    });
  }
  get basketItems(): IBasketItem[] {
    return this._basketItems;
  }

  private _basketItems: IBasketItem[] = [];

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _modal: NgbActiveModal,
    private readonly _basketService: BasketService
  ) {}

  public continue(): void {
    if (this.form.valid) {
      this._modal.close(this.form.value);
    }
  }
}
