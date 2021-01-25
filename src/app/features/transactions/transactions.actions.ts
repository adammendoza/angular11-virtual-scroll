import { Action } from '@ngrx/store';

import { Transaction } from './models/transaction.model';

export enum TransactionActionTypes {
  RESET_STATE = '[Transaction] Reset State',
  SET_TRANSACTIONS_CURSOR_ID = '[Transaction] Set Transactions Cursor Id',
  GET_TRANSACTIONS_LOAD = '[Transaction] Get Transactions Load',
  GET_TRANSACTIONS_START = '[Transaction] Get Transactions Start',
  GET_TRANSACTIONS_SUCCESS = '[Transaction] Get Transactions Success',
  GET_TRANSACTIONS_ERROR = '[Transaction] Get Transactions Error',
  GET_TRANSACTIONS_STOP = '[Transaction] Get Transactions',
}

export class ResetState implements Action {
  readonly type = TransactionActionTypes.RESET_STATE;
}

export class SetTransactionsCursorId implements Action {
  readonly type = TransactionActionTypes.SET_TRANSACTIONS_CURSOR_ID;

  constructor(public payload: number) {}
}

export class GetTransactionsLoad implements Action {
  readonly type = TransactionActionTypes.GET_TRANSACTIONS_LOAD;
}

export class GetTransactionsStart implements Action {
  readonly type = TransactionActionTypes.GET_TRANSACTIONS_START;
}

export class GetTransactionsSuccess implements Action {
  readonly type = TransactionActionTypes.GET_TRANSACTIONS_SUCCESS;

  constructor(public payload: Transaction[]) {}
}

export class GetTransactionsError implements Action {
  readonly type = TransactionActionTypes.GET_TRANSACTIONS_ERROR;

  constructor(public payload: any) {}
}
export class GetTransactionsStop implements Action {
  readonly type = TransactionActionTypes.GET_TRANSACTIONS_STOP;
}
export type TransactionActions =
  | ResetState
  | SetTransactionsCursorId
  | GetTransactionsLoad
  | GetTransactionsStart
  | GetTransactionsSuccess
  | GetTransactionsError
  | GetTransactionsStop;
