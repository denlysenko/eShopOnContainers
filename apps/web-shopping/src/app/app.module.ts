import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AuthInterceptor } from 'angular-auth-oidc-client';
import { AppComponent } from './app.component';
import { AuthConfigModule } from './auth-config.module';
import { CatalogComponent } from './catalog/catalog.component';
import { CatalogModule } from './catalog/catalog.module';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      [
        { path: '', redirectTo: 'catalog', pathMatch: 'full' },
        { path: 'catalog', component: CatalogComponent },
        {
          path: 'basket',
          loadChildren: () =>
            import('./basket/basket.module').then((m) => m.BasketModule),
        },
        { path: '**', component: PageNotFoundComponent },
      ],
      {
        initialNavigation: 'enabledBlocking',
      }
    ),
    AuthConfigModule,
    SharedModule.forRoot(),
    CatalogModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
