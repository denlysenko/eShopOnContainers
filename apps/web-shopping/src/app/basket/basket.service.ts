import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mapTo, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IBasketCheckout } from './models/basket-checkout.model';
import { ICardType } from './models/card-type.model';

@Injectable()
export class BasketService {
  private readonly _basketUrl: string = `${environment.apiUrl}/basket`;
  private readonly _ordersUrl: string = `${environment.apiUrl}/orders`;

  constructor(private readonly _httpClient: HttpClient) {}

  getCardTypes(): Observable<ICardType[]> {
    return this._httpClient.get<ICardType[]>(`${this._ordersUrl}/card-types`);
  }

  checkout(basketCheckout: IBasketCheckout): Observable<boolean> {
    return this._httpClient
      .post(`${this._basketUrl}/checkout`, basketCheckout)
      .pipe(mapTo(true));
  }
}
