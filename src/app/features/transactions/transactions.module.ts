import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { TransactionsPageComponent } from './transactions-page/transactions-page.component';


@NgModule({
  declarations: [TransactionsPageComponent],
  imports: [
    CommonModule,
    StoreModule.forFeature('transactions', {}, {})
  ]
})
export class TransactionsModule { }
