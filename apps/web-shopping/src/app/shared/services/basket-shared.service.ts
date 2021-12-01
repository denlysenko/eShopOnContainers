import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  map,
  mapTo,
  merge,
  Observable,
  shareReplay,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { IBasketItem } from '../models/basket-item.model';
import { IBasket } from '../models/basket.model';
import { ICatalogItem } from '../models/catalog-item.model';

@Injectable()
export class BasketSharedService {
  private readonly _basketUrl: string = `${environment.apiUrl}/basket`;
  private readonly _basketItemsSource = new Subject<void>();
  private _basketItems: IBasketItem[] = [];

  public readonly basketItems$ = merge(
    this._getBasket(),
    this._basketItemsSource
      .asObservable()
      .pipe(switchMap(() => this._getBasket()))
  ).pipe(shareReplay({ refCount: true, bufferSize: 1 }));

  constructor(private readonly _httpClient: HttpClient) {}

  public setBasket(basketItems: IBasketItem[]): Observable<boolean> {
    return this._httpClient.post(`${this._basketUrl}`, basketItems).pipe(
      tap(() => this._basketItemsSource.next()),
      mapTo(true)
    );
  }

  public addItemToBasket(item: ICatalogItem): void {
    const itemIndex = this._basketItems.findIndex(
      (basketItem) => basketItem.productId === item.id
    );

    if (itemIndex !== -1) {
      this._basketItems = [
        ...this._basketItems.slice(0, itemIndex),
        {
          ...this._basketItems[itemIndex],
          quantity: this._basketItems[itemIndex].quantity + 1,
        },
        ...this._basketItems.slice(itemIndex + 1),
      ];
    } else {
      this._basketItems = [
        ...this._basketItems,
        {
          pictureUrl: item.pictureUri,
          productId: item.id,
          productName: item.name,
          quantity: 1,
          unitPrice: item.price,
          oldUnitPrice: 0,
        },
      ];
    }

    this.setBasket(this._basketItems).subscribe();
  }

  public setBasketCheckedOut(): void {
    this._basketItemsSource.next();
  }

  private _getBasket(): Observable<IBasketItem[]> {
    return this._httpClient.get<IBasket>(`${this._basketUrl}`).pipe(
      tap(({ basketItems }) => (this._basketItems = basketItems)),
      map(({ basketItems }) => basketItems)
    );
  }
}
