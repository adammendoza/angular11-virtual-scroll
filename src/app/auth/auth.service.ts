import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthData } from './models/auth-data.model';
import { UIService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  initAuthListener() {
    // read auth api listener
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.store.dispatch(new Auth.SetUserId(environment.RECEIVER_ID));
    this.store.dispatch(new Auth.SetAuthenticated());
    this.store.dispatch(new UI.StopLoading());
    this.router.navigate(['/transactions']);
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.store.dispatch(new UI.StartLoading());
    this.store.dispatch(new Auth.SetUserId(environment.RECEIVER_ID));
    this.store.dispatch(new Auth.SetAuthenticated());
    this.store.dispatch(new UI.StopLoading());
    this.router.navigate(['/transactions']);
  }

  logout() {
    this.store.dispatch(new Auth.SetUserId(''));
    this.store.dispatch(new Auth.SetUnauthenticated());
    this.router.navigate(['/login']);
  }
}
