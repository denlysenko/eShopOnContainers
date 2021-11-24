import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BasketComponent } from './basket.component';
import { BasketService } from './basket.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: BasketComponent,
      },
    ]),
    SharedModule,
  ],
  declarations: [BasketComponent],
  providers: [BasketService],
})
export class BasketModule {}
