import { Action, createFeatureSelector, createSelector } from '@ngrx/store';

import { TransactionActions, TransactionActionTypes } from './transactions.actions';
import { Transaction } from './models/transaction.model';
import * as fromRoot from '../../app.reducer';


export interface State extends fromRoot.State {
  transaction: TransactionState;
}

export interface TransactionState {
  transactionCursorId: number;
  transactions: Transaction[];
}

const initialState: TransactionState = {
  transactionCursorId: 0,
  transactions: []
};

export function transactionReducer(state = initialState, action: TransactionActions) {
  switch (action.type) {
    case TransactionActionTypes.RESET_STATE:
      return Object.assign({}, initialState);
    case TransactionActionTypes.SET_TRANSACTIONS_CURSOR_ID:
      return {
        ...state,
        transactionCursorId: action.payload
      };
    case TransactionActionTypes.GET_TRANSACTIONS:
        return state;
    case TransactionActionTypes.GET_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactions: action.payload
      };
    case TransactionActionTypes.GET_TRANSACTIONS_ERROR:
      return {
        ...state,
        transactions: action.payload
      };
    default: {
      return state;
    }
  }
}

export const getTransactionState = createFeatureSelector<TransactionState>('transaction');

export const getTransactions = createSelector(
  getTransactionState,
  (state: TransactionState) => state.transactions
);
