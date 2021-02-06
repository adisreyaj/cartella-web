import { Injectable } from '@angular/core';
import { User } from '@app/interfaces/user.interface';
import { AuthService } from '@app/services/auth/auth.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  GetLoggedInUser,
  LogoutUser,
  SetLoggedInUser,
} from '../actions/user.action';

export class UserStateModel {
  user: User;
}

@State({
  name: 'user',
})
@Injectable()
export class UserState {
  constructor(private auth: AuthService) {}

  @Selector()
  static getLoggedInUser(state: UserStateModel) {
    return state.user;
  }

  @Action(GetLoggedInUser)
  getLoggedInUser({ getState, setState }: StateContext<UserStateModel>) {
    const token = localStorage.getItem('token') || null;
    if (token) {
      const res = this.auth.getUserAssociatedWithToken(token);
      if (res instanceof Error) {
        return throwError(new Error('Failed to login'));
      }
      return res.pipe(
        tap((user) => {
          const state = getState();
          setState({
            ...state,
            user,
          });
        })
      );
    }
    return throwError(new Error('Failed to login'));
  }

  @Action(SetLoggedInUser)
  setLoggedInUser(
    { getState, setState }: StateContext<UserStateModel>,
    { payload }: SetLoggedInUser
  ) {
    const state = getState();
    setState({
      ...state,
      user: payload,
    });
  }

  @Action(LogoutUser)
  logout({ getState, setState }: StateContext<UserStateModel>) {
    localStorage.removeItem('token');
    const state = getState();
    setState({
      ...state,
      user: null,
    });
    this.auth.returnToLogin();
  }
}
