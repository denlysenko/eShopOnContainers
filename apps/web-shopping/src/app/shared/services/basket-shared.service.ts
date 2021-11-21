import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, merge, Observable, of, Subject } from 'rxjs';
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
    // return this._httpClient.get('')
    return of({
      buyerId: 'test',
      basketItems: [],
    });
  }
}
