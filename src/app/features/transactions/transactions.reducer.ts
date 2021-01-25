import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import * as moment from 'moment-mini-ts';

import { TransactionActions, TransactionActionTypes } from './transactions.actions';
import { Transaction } from './models/transaction.model';
import * as fromRoot from '../../app.reducer';


export interface State extends fromRoot.State {
  transactions: TransactionsState;
}

export interface TransactionsState {
  transactionsCursorId: number;
  ids: number[];
  transactions: Transaction[];
  stream: boolean;
}

const initialState: TransactionsState = {
  transactionsCursorId: 0,
  ids: [],
  transactions: [],
  stream: false,
};

export function transactionsReducer(state = initialState, action: TransactionActions) {
  switch (action.type) {
    case TransactionActionTypes.RESET_STATE:
      return Object.assign({}, initialState);
    case TransactionActionTypes.SET_TRANSACTIONS_CURSOR_ID:
      return {
        ...state,
        transactionsCursorId: action.payload
      };
    case TransactionActionTypes.GET_TRANSACTIONS_LOAD:
      return {
          ...state,
          stream: true,
        };
    case TransactionActionTypes.GET_TRANSACTIONS_START:
      return {
          ...state,
          stream: true,
        };
    case TransactionActionTypes.GET_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        ids: [
            ...action.payload
                .map(trans => trans.rowId)
                .reverse()
        ],
        transactions: state.transactions.concat(action.payload).slice(),
        transactionsCursorId: action.payload.slice(-1)[0].rowId,
        stream: true,
        };
    case TransactionActionTypes.GET_TRANSACTIONS_ERROR:
      return {
        ...state,
        transactions: action.payload
      };
    case TransactionActionTypes.GET_TRANSACTIONS_STOP:
      return {
        ...state,
        stream: false
      };
    default: {
      return state;
    }
  }
}

export const getTransactionsState = createFeatureSelector<TransactionsState>('transactions');

export const getTransactions = createSelector(
  getTransactionsState,
  (state: TransactionsState) => state.transactions
);
