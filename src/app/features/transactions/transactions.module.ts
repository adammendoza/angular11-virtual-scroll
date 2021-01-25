import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { TransactionsPageComponent } from './transactions-page/transactions-page.component';
import { TransactionsRoutingModule } from './transactions-routing.module';

@NgModule({
  declarations: [TransactionsPageComponent],
  imports: [
    CommonModule,
    StoreModule.forFeature('transactions', {}, {}),
    TransactionsRoutingModule
  ]
})
export class TransactionsModule { }
