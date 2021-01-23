import { Action } from '@ngrx/store';

import { AuthActions, SET_AUTHENTICATED, SET_UNAUTHENTICATED, SET_USER_ID } from './auth.actions';

export interface State {
  isAuthenticated: boolean;
  userId: string;
}

const initialState: State = {
  isAuthenticated: false,
  userId: ''
};

export function authReducer(state = initialState, action: AuthActions) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: true
      };
    case SET_USER_ID:
      return {
        ...state,
        userId: action.payload
      };
    case SET_UNAUTHENTICATED:
      return {
        ...state,
        isAuthenticated: false
      };
    default: {
      return state;
    }
  }
}

export const getIsAuth = (state: State) => state.isAuthenticated;
export const getUserId = (state: State) => state.userId;
