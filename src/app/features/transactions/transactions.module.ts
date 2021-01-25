import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { SharedModule } from '../../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TransactionsPageComponent } from './transactions-page/transactions-page.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsEffects } from './transactions.effects';
import { transactionsReducer } from './transactions.reducer';

@NgModule({
  declarations: [
    TransactionsPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    StoreModule.forFeature('transactions', transactionsReducer),
    TransactionsRoutingModule,

    EffectsModule.forFeature([
      TransactionsEffects,
    ]),
  ]
})
export class TransactionsModule { }
