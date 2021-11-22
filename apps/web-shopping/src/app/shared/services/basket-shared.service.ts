import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, merge, Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IBasketItem } from '../models/basket-item.model';
import { IBasket } from '../models/basket.model';

@Injectable()
export class BasketSharedService {
  private readonly _basketItemsSource = new Subject<IBasketItem[]>();

  basketItems$ = merge(
    this._getBasket().pipe(map(({ basketItems }) => basketItems)),
    this._basketItemsSource.asObservable()
  );

  constructor(private readonly _httpClient: HttpClient) {}

  private _getBasket(): Observable<IBasket> {
    return this._httpClient.get<IBasket>(`${environment.apiUrl}/basket`);
  }
}
