import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { Transaction } from './models/transaction.model';
import { UIService } from '../../shared/ui.service';
import * as UI from '../../shared/ui.actions';
import * as Transactions from './transactions.actions';
import * as fromTransactions from './transactions.reducer';
import * as fromAuth from '../../app.reducer';

@Injectable()
export class TransactionsService {
  private isAuth$: Observable<boolean>;
  private userId: string;
  private cursorId: number;

  constructor(
    private router: Router,
    private uiService: UIService,
    private store: Store<fromTransactions.State>,
    private authStore: Store<fromAuth.State>
  ) {
    this.userId = '';
    this.cursorId = 0;
    this.isAuth$ = this.authStore.select(fromAuth.getIsAuth);

    this.isAuth$.subscribe(isAuth => {
      if (isAuth === true) {
        this.authStore
          .select(fromAuth.getUserId)
          .pipe(take(1))
          .subscribe(userId => {
            this.userId = userId;
          });
      } else {
        this.userId = '';
        this.store.dispatch(new Transactions.ResetState());
        this.cancelSubscriptions();
      }
    });
  }

  fetchTransactions() {
    let url = ''

    url += `/tables/op?columns=row_id,time,type,sender,volume&receiver=tz1gfArv665EUkSg2ojMBzcbfwuPxAvqPvjo&type=transaction&limit=10&cursor.gte=${this.cursorId}`

  }

  cancelSubscriptions() {
  }

}
