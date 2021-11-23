import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import {
  BehaviorSubject,
  catchError,
  map,
  merge,
  Observable,
  Subject,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { IPager } from '../shared/models/pager.model';
import { CatalogService } from './catalog.service';
import { ICatalogBrand } from './models/catalog-brand.model';
import { ICatalogItem } from './models/catalog-item.model';
import { ICatalogType } from './models/catalog-type.model';
import { ICatalog } from './models/catalog.model';

@Component({
  selector: 'esh-catalog .esh-catalog',
  styleUrls: ['./catalog.component.scss'],
  templateUrl: './catalog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent {
  public readonly brands$: Observable<ICatalogBrand[]> = this._catalogService
    .getBrands()
    .pipe(tap((brands) => brands.unshift({ id: null, brand: 'All' })));

  public readonly types$: Observable<ICatalogType[]> = this._catalogService
    .getTypes()
    .pipe(tap((types) => types.unshift({ id: null, type: 'All' })));

  public readonly isAuthenticated$: Observable<boolean> =
    this._oidcSecurityService.isAuthenticated$.pipe(
      map(({ isAuthenticated }) => isAuthenticated)
    );

  private _brandSelected?: number;
  private _typeSelected?: number;

  private readonly _filterChangedSource = new Subject<void>();
  private readonly _pageChangedSource = new Subject<void>();
  private readonly _errorReceived = new BehaviorSubject<boolean>(false);

  private readonly _paginationInfo = new BehaviorSubject<IPager>({
    actualPage: 0,
    itemsPage: 10,
    totalItems: 0,
    totalPages: 0,
    items: 0,
  });

  public readonly paginationInfo$: Observable<IPager> =
    this._paginationInfo.asObservable();

  public readonly errorReceived$: Observable<boolean> =
    this._errorReceived.asObservable();

  public readonly catalog$: Observable<ICatalog> = merge(
    this._catalogService.getCatalog(0, 10),
    this._filterChangedSource.asObservable().pipe(
      switchMap(() => {
        const { itemsPage, actualPage } = this._paginationInfo.getValue();

        return this._catalogService.getCatalog(
          actualPage,
          itemsPage,
          this._brandSelected,
          this._typeSelected
        );
      })
    ),
    this._pageChangedSource.asObservable().pipe(
      switchMap(() => {
        const { itemsPage, actualPage } = this._paginationInfo.getValue();

        return this._catalogService.getCatalog(
          actualPage,
          itemsPage,
          this._brandSelected,
          this._typeSelected
        );
      })
    )
  ).pipe(
    tap((catalog) => {
      this._paginationInfo.next({
        actualPage: catalog.pageIndex,
        itemsPage: catalog.pageSize,
        totalItems: catalog.count,
        totalPages: Math.ceil(catalog.count / catalog.pageSize),
        items: catalog.pageSize,
      });
    }),
    catchError((error) => this.handleError(error))
  );

  constructor(
    private readonly _catalogService: CatalogService,
    // private basketService: BasketWrapperService,
    private readonly _oidcSecurityService: OidcSecurityService
  ) {}

  onFilterApplied(event: Event) {
    event.preventDefault();
    this._errorReceived.next(false);
    this._filterChangedSource.next();
  }

  onBrandFilterChanged(event: Event) {
    event.preventDefault();
    this._brandSelected = parseInt(
      (event.target as HTMLSelectElement).value,
      10
    );
  }

  onTypeFilterChanged(event: Event) {
    event.preventDefault();
    this._typeSelected = parseInt(
      (event.target as HTMLSelectElement).value,
      10
    );
  }

  onPageChanged(value: number) {
    const paginationInfo = this._paginationInfo.getValue();

    this._errorReceived.next(false);
    this._paginationInfo.next({
      ...paginationInfo,
      actualPage: value,
    });
    this._pageChangedSource.next();
  }

  addToCart(item: ICatalogItem) {
    // this.basketService.addItemToBasket(item);
  }

  private handleError(error: any) {
    this._errorReceived.next(true);

    return throwError(() => error);
  }
}
