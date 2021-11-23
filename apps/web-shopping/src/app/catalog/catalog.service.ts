import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ICatalogBrand } from './models/catalog-brand.model';
import { ICatalogType } from './models/catalog-type.model';
import { ICatalog } from './models/catalog.model';

@Injectable()
export class CatalogService {
  private readonly catalogUrl: string = `${environment.apiUrl}/catalog/items`;
  private readonly brandUrl: string = `${environment.apiUrl}/catalog/catalog-brands`;
  private readonly typesUrl: string = `${environment.apiUrl}/catalog/catalog-types`;

  constructor(private readonly _httpClient: HttpClient) {}

  getCatalog(
    pageIndex: number,
    pageSize: number,
    brand?: number,
    type?: number
  ): Observable<ICatalog> {
    let url = this.catalogUrl;

    if (type) {
      url =
        this.catalogUrl +
        '/type/' +
        type.toString() +
        '/brand/' +
        (brand ? brand.toString() : 'all');
    } else if (brand) {
      url =
        this.catalogUrl +
        '/type/all' +
        '/brand/' +
        (brand ? brand.toString() : '');
    }

    url = url + '?pageIndex=' + pageIndex + '&pageSize=' + pageSize;

    return this._httpClient.get<ICatalog>(url);
  }

  getBrands(): Observable<ICatalogBrand[]> {
    return this._httpClient.get<ICatalogBrand[]>(this.brandUrl);
  }

  getTypes(): Observable<ICatalogType[]> {
    return this._httpClient.get<ICatalogType[]>(this.typesUrl);
  }
}
