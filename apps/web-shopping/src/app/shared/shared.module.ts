import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BasketStatusComponent } from './components/basket-status/basket-status.component';
import { Header } from './components/header/header';
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
  ],
  declarations: [
    Identity,
    PageNotFoundComponent,
    BasketStatusComponent,
    Pager,
    Header,
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
    Header,
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
