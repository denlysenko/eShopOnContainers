import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'e-shop-on-containers-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'web-shopping';

  constructor(private readonly _oidcSecurityService: OidcSecurityService) {}

  ngOnInit(): void {
    this._oidcSecurityService
      .checkAuth()
      .subscribe(({ isAuthenticated, accessToken }) => {
        console.log('app authenticated', isAuthenticated);
        console.log(`Current access token is '${accessToken}'`);
      });
  }
}
