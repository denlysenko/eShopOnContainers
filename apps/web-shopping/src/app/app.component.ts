import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'e-shop-on-containers-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isAuthenticated$: Observable<boolean> =
    this._oidcSecurityService.isAuthenticated$.pipe(
      map(({ isAuthenticated }) => isAuthenticated)
    );

  constructor(private readonly _oidcSecurityService: OidcSecurityService) {}

  ngOnInit(): void {
    this._oidcSecurityService.checkAuth().subscribe();
  }
}
