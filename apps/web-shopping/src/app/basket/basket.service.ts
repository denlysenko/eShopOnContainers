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
  //   private basketUrl: string = '';
  //   private purchaseUrl: string = '';
  //   basket: IBasket = {
  //     buyerId: '',
  //     items: [],
  //   };
  //   //observable that is fired when the basket is dropped
  //   private basketDropedSource = new Subject();
  //   basketDroped$ = this.basketDropedSource.asObservable();
  constructor(private readonly _httpClient: HttpClient) {}
  //   constructor(
  //     private service: DataService,
  //     private authService: SecurityService,
  //     private basketEvents: BasketWrapperService,
  //     private router: Router,
  //     private configurationService: ConfigurationService,
  //     private storageService: StorageService
  //   ) {
  //     this.basket.items = [];
  //     // Init:
  //     if (this.authService.IsAuthorized) {
  //       if (this.authService.UserData) {
  //         this.basket.buyerId = this.authService.UserData.sub;
  //         if (this.configurationService.isReady) {
  //           this.basketUrl = this.configurationService.serverSettings.purchaseUrl;
  //           this.purchaseUrl =
  //             this.configurationService.serverSettings.purchaseUrl;
  //           this.loadData();
  //         } else {
  //           this.configurationService.settingsLoaded$.subscribe((x) => {
  //             this.basketUrl =
  //               this.configurationService.serverSettings.purchaseUrl;
  //             this.purchaseUrl =
  //               this.configurationService.serverSettings.purchaseUrl;
  //             this.loadData();
  //           });
  //         }
  //       }
  //     }
  //     this.basketEvents.orderCreated$.subscribe((x) => {
  //       this.dropBasket();
  //     });
  //   }
  //   addItemToBasket(item): Observable<boolean> {
  //     this.basket.items.push(item);
  //     return this.setBasket(this.basket);
  //   }
  getCardTypes(): Observable<ICardType[]> {
    return this._httpClient.get<ICardType[]>(`${this._ordersUrl}/card-types`);
  }

  checkout(basketCheckout: IBasketCheckout): Observable<boolean> {
    return this._httpClient
      .post(`${this._basketUrl}/checkout`, basketCheckout)
      .pipe(mapTo(true));
  }
  //   getBasket(): Observable<IBasket> {
  //     let url = this.basketUrl + '/b/api/v1/basket/' + this.basket.buyerId;
  //     return this.service.get(url).pipe<IBasket>(
  //       tap((response: any) => {
  //         if (response.status === 204) {
  //           return null;
  //         }
  //         return response;
  //       })
  //     );
  //   }
  //   mapBasketInfoCheckout(order: IOrder): IBasketCheckout {
  //     let basketCheckout = <IBasketCheckout>{};
  //     basketCheckout.street = order.street;
  //     basketCheckout.city = order.city;
  //     basketCheckout.country = order.country;
  //     basketCheckout.state = order.state;
  //     basketCheckout.zipcode = order.zipcode;
  //     basketCheckout.cardexpiration = order.cardexpiration;
  //     basketCheckout.cardnumber = order.cardnumber;
  //     basketCheckout.cardsecuritynumber = order.cardsecuritynumber;
  //     basketCheckout.cardtypeid = order.cardtypeid;
  //     basketCheckout.cardholdername = order.cardholdername;
  //     basketCheckout.total = 0;
  //     basketCheckout.expiration = order.expiration;
  //     return basketCheckout;
  //   }
  //   dropBasket() {
  //     this.basket.items = [];
  //     this.basketDropedSource.next();
  //   }
  //   private loadData() {
  //     this.getBasket().subscribe((basket) => {
  //       if (basket != null) this.basket.items = basket.items;
  //     });
  //   }
}
