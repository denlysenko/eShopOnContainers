import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'esh-identity',
  templateUrl: './identity.html',
  styleUrls: ['./identity.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Identity {
  userData$ = this._oidcSecurityService.userData$;
  isAuthenticated$: Observable<boolean> =
    this._oidcSecurityService.isAuthenticated$.pipe(
      map(({ isAuthenticated }) => isAuthenticated)
    );

  constructor(private readonly _oidcSecurityService: OidcSecurityService) {}

  logoutClicked(event: any) {
    event.preventDefault();
    console.log('Logout clicked');
    this.logout();
  }

  login() {
    this._oidcSecurityService.authorize();
  }

  logout() {
    this._oidcSecurityService.logoff();
  }
}
