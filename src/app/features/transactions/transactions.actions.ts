import { Action } from '@ngrx/store';

import { Transaction } from './models/transaction.model';

export enum TransactionActionTypes {
  RESET_STATE = '[Transaction] Reset State',
  SET_TRANSACTIONS_CURSOR_ID = '[Transaction] Set Transactions Cursor Id',
  GET_TRANSACTIONS = '[Transaction] Get Transactions',
  GET_TRANSACTIONS_SUCCESS = '[Transaction] Get Transactions Sucsess',
  GET_TRANSACTIONS_ERROR = '[Transaction] Get Transactions Error'
}

export class ResetState implements Action {
  readonly type = TransactionActionTypes.RESET_STATE;
}

export class SetTransactionsCursorId implements Action {
  readonly type = TransactionActionTypes.SET_TRANSACTIONS_CURSOR_ID;

  constructor(public payload: number) {}
}

export class GetTransactions implements Action {
  readonly type = TransactionActionTypes.GET_TRANSACTIONS;
}

export class GetTransactionsSuccess implements Action {
  readonly type = TransactionActionTypes.GET_TRANSACTIONS_SUCCESS;

  constructor(public payload: Transaction[]) {}
}

export class GetTransactionsError implements Action {
  readonly type = TransactionActionTypes.GET_TRANSACTIONS_ERROR;

  constructor(public payload: Transaction[]) {}
}

export type TransactionActions =
  | ResetState
  | SetTransactionsCursorId
  | GetTransactions
  | GetTransactionsSuccess
  | GetTransactionsError;
