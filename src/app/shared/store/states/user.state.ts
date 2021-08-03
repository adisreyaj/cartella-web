import { Injectable } from '@angular/core';
import { User } from '@cartella/interfaces/user.interface';
import { AuthService, UserService } from '@cartella/ui/services';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  GetLoggedInUser,
  LogoutUser,
  SetLoggedInUser,
  UpdateUser,
  UpdateUserLoginMethod,
} from '../actions/user.action';

export class UserStateModel {
  user: User | null = null;
}

@State({
  name: 'user',
})
@Injectable()
export class UserState {
  constructor(private auth: AuthService, private user: UserService) {}

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
        }),
      );
    }
    return throwError(new Error('Failed to login'));
  }

  @Action(SetLoggedInUser)
  setLoggedInUser({ getState, setState }: StateContext<UserStateModel>, { payload }: SetLoggedInUser) {
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
  }

  @Action(UpdateUser)
  updateUser({ patchState }: StateContext<UserStateModel>, { id, payload }: UpdateUser) {
    return this.user.updateUser(id, payload).pipe(
      tap((result) => {
        patchState({
          user: result,
        });
      }),
    );
  }

  @Action(UpdateUserLoginMethod)
  updateUserLoginMethod({ getState, setState }: StateContext<UserStateModel>, { id, payload }: UpdateUserLoginMethod) {
    return this.auth.updateUserLoginMethod(id, payload).pipe(
      tap((result) => {
        const state = getState();
        if (state.user) {
          setState({
            ...state,
            user: {
              ...state.user,
              loginMethods: result.loginMethods,
            },
          });
        }
      }),
    );
  }
}
