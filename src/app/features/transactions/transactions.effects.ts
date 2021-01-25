import { Injectable, NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { tap, map, take, switchMap, withLatestFrom, catchError, takeUntil } from 'rxjs/operators';
import { of, Subject, empty, timer, pipe } from 'rxjs';
import * as moment from 'moment-mini-ts';

import { Transaction } from './models/transaction.model';
import { UIService } from '../../shared/ui.service';
import * as UI from '../../shared/ui.actions';
import * as transactionsActions from './transactions.actions';
import * as fromTransactions from './transactions.reducer';
import * as fromAuth from '../../app.reducer';

import { environment } from '../../../environments/environment';

const storageActionDestroy$ = new Subject();

@Injectable()
export class TransactionsEffects {

  private isAuth$: Observable<boolean>;
  private receiverId: string;
  private rowLimit = 15;

    @Effect()
    StorageBlock$ = this.actions$.pipe(
        ofType('GET_TRANSACTIONS_LOAD'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),
        switchMap(({ action, state }) => {
            let url = environment.API_URL;
            let cursorId = state.transactions.transactionsCursorId ? state.transactions.transactionsCursorId : 0;
            url += `/tables/op?columns=row_id,time,type,sender,volume&receiver=${this.receiverId}&type=transaction&limit=${this.rowLimit}&cursor.gte=${cursorId}`
            return this.http.get(url);
        }),

        map(response => {
          return (<Array<any>>response).map((tx: Array<any>) => {
            return <Transaction> {rowId: tx[0], datetime: moment(tx[1]).format('HH:mm:ss,  DD MMM YYYY'), type: tx[2], addressId: tx[3], amount: tx[4] };
          });
        }),

        // dispatch action
        map((response) => ({ type: transactionsActions.TransactionActionTypes.GET_TRANSACTIONS_SUCCESS, payload: response })),
        catchError((error, caught) => {
            console.error(error);
            this.store.dispatch({
                type: transactionsActions.TransactionActionTypes.GET_TRANSACTIONS_ERROR,
                payload: error,
            });
            return caught;
        })

    );


    @Effect()
    NetworkActionStartEffect$ = this.actions$.pipe(
        ofType('GET_TRANSACTIONS_START'),

        // merge state
        withLatestFrom(this.store, (action: any, state) => ({ action, state })),
        switchMap(({ action, state }) =>

            // get data every second
            timer(0, 10000).pipe(
                takeUntil(storageActionDestroy$),
                switchMap(() => {
                    let url = environment.API_URL;
                    let cursorId = state.transactions.transactionsCursorId ? state.transactions.transactionsCursorId : 0;
                    url += `/tables/op?columns=row_id,time,type,sender,volume&receiver=${this.receiverId}&type=transaction&limit=${this.rowLimit}&cursor.gte=${cursorId}`
                    return this.http.get(url).pipe(
                      map(response => {
                        return (<Array<any>>response).map((tx: Array<any>) => {
                          return <Transaction> {rowId: tx[0], datetime: moment(tx[1]).format('HH:mm:ss,  DD MMM YYYY'), type: tx[2], addressId: tx[3], amount: tx[4] };
                        });
                      }),
                      map(response => ({ type: transactionsActions.TransactionActionTypes.GET_TRANSACTIONS_SUCCESS, payload: response })),
                      catchError(error => of({ type: transactionsActions.TransactionActionTypes.GET_TRANSACTIONS_ERROR, payload: error })),
                    );
                }
                )
            )
        ),
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
          this.store.dispatch(new transactionsActions.ResetState());
        }
      });
    }

}
