import { Injectable, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { tap, map, take, switchMap, withLatestFrom, catchError, takeUntil } from 'rxjs/operators';
import { of, Subject, empty, timer, pipe } from 'rxjs';

import { Transaction } from './models/transaction.model';
import { UIService } from '../../shared/ui.service';
import * as UI from '../../shared/ui.actions';
import * as Transactions from './transactions.actions';
import * as fromTransactions from './transactions.reducer';
import * as fromAuth from '../../app.reducer';

import { environment } from '../../../environments/environment';

const storageActionDestroy$ = new Subject();

@Injectable()
export class StorageBlockEffects {

  private isAuth$: Observable<boolean>;
  private receiverId: string;
  private cursorId: number;

    @Effect()
    StorageBlock$ = this.actions$.pipe(
        ofType('GET_TRANSACTIONS'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),
        switchMap(({ action, state }) => {
            let url = environment.API_URL;
            url += `/tables/op?columns=row_id,time,type,sender,volume&receiver=${this.receiverId}&type=transaction&limit=10&cursor.gte=${state.transaction.transactionCursorId}`
            return this.http.get(url);
        }),

        tap((payload) => ({ type: 'SET_TRANSACTIONS_CURSOR_ID', payload: (<Array<Transaction>>payload).slice(-1)[0].rowId })),

        // dispatch action
        map((payload) => ({ type: 'GET_TRANSACTIONS_SUCCESS', payload: payload })),
        catchError((error, caught) => {
            console.error(error);
            this.store.dispatch({
                type: 'GET_TRANSACTIONS_ERROR',
                payload: error,
            });
            return caught;
        })

    );

    @Effect({ dispatch: false })
    StorageBlockStopEffect$ = this.actions$.pipe(
        ofType('GET_TRANSACTIONS_STOP'),
        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),
        // init app modules
        tap(({ action, state }) => {
            storageActionDestroy$.next();
        }),
    );

    constructor(
        private http: HttpClient,
        private actions$: Actions,
        private store: Store<fromTransactions.State>,
        private authStore: Store<fromAuth.State>
    ) {
      this.receiverId = '';
      this.cursorId = 0;
      this.isAuth$ = this.authStore.select(fromAuth.getIsAuth);

      this.isAuth$.subscribe(isAuth => {
        if (isAuth === true) {
          this.authStore
            .select(fromAuth.getUserId)
            .pipe(take(1))
            .subscribe(receiverId => {
              this.receiverId = receiverId;
            });
        } else {
          this.receiverId = '';
          this.store.dispatch(new Transactions.ResetState());
        }
      });
    }

}
