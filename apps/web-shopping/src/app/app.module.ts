import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthConfigModule } from './auth-config.module';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([{ path: '**', component: PageNotFoundComponent }], {
      initialNavigation: 'enabledBlocking',
    }),
    AuthConfigModule,
    SharedModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
