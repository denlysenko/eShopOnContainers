import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    AuthModule.forRoot({
      config: {
        authority: `${environment.ssoUrl}/auth/realms/e-shop-on-containers`,
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: 'web_shopping',
        scope: 'openid profile offline_access',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        renewTimeBeforeTokenExpiresInSeconds: 120,
        ignoreNonceAfterRefresh: true,
        secureRoutes: [environment.apiUrl],
        logLevel: environment.production ? LogLevel.None : LogLevel.Debug,
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
