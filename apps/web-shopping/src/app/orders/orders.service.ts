import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IOrderDetail } from './models/order-detail.model';

@Injectable()
export class OrdersService {
  private readonly _ordersUrl: string = `${environment.apiUrl}/orders`;

  constructor(private readonly _httpClient: HttpClient) {}

  getOrders(): Observable<IOrderDetail[]> {
    return this._httpClient.get<IOrderDetail[]>(this._ordersUrl);
  }

  getOrder(id: number): Observable<IOrderDetail> {
    return this._httpClient.get<IOrderDetail>(`${this._ordersUrl}/${id}`);
  }

  //   mapOrderAndIdentityInfoNewOrder(): IOrder {
  //     let order = <IOrder>{};
  //     let basket = this.basketService.basket;
  //     let identityInfo = this.identityService.UserData;

  //     console.log(basket);
  //     console.log(identityInfo);

  //     // Identity data mapping:
  //     order.street = identityInfo.address_street;
  //     order.city = identityInfo.address_city;
  //     order.country = identityInfo.address_country;
  //     order.state = identityInfo.address_state;
  //     order.zipcode = identityInfo.address_zip_code;
  //     order.cardexpiration = identityInfo.card_expiration;
  //     order.cardnumber = identityInfo.card_number;
  //     order.cardsecuritynumber = identityInfo.card_security_number;
  //     order.cardtypeid = identityInfo.card_type;
  //     order.cardholdername = identityInfo.card_holder;
  //     order.total = 0;
  //     order.expiration = identityInfo.card_expiration;

  //     // basket data mapping:
  //     order.orderItems = new Array<IOrderItem>();
  //     basket.items.forEach((x) => {
  //       let item: IOrderItem = <IOrderItem>{};
  //       item.pictureurl = x.pictureUrl;
  //       item.productId = +x.productId;
  //       item.productname = x.productName;
  //       item.unitprice = x.unitPrice;
  //       item.units = x.quantity;

  //       order.total += item.unitprice * item.units;

  //       order.orderItems.push(item);
  //     });

  //     order.buyer = basket.buyerId;

  //     return order;
  //   }
}
