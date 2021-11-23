import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BasketStatusComponent } from './components/basket-status/basket-status.component';
import { Identity } from './components/identity/identity';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { Pager } from './components/pager/pager';
import { UppercasePipe } from './pipes/uppercase.pipe';
import { BasketSharedService } from './services/basket-shared.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  declarations: [
    Identity,
    PageNotFoundComponent,
    BasketStatusComponent,
    Pager,
    UppercasePipe,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    Identity,
    PageNotFoundComponent,
    BasketStatusComponent,
    Pager,
    UppercasePipe,
  ],
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
      providers: [BasketSharedService],
    };
  }
}
