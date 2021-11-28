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
}
