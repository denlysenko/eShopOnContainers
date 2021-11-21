import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Identity } from './components/identity/identity';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UppercasePipe } from './pipes/uppercase.pipe';

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
  declarations: [Identity, PageNotFoundComponent, UppercasePipe],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    Identity,
    PageNotFoundComponent,
    UppercasePipe,
  ],
})
export class SharedModule {}
