import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AUTH_ENDPOINTS,
  CARTELLA_ENDPOINTS,
} from '@app/config/endpoints.config';
import { environment } from '@app/env/environment';
import { LoggedUser, User } from '@app/interfaces/user.interface';
import { SetLoggedInUser } from '@app/store/actions/user.action';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Store } from '@ngxs/store';
import { ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WithDestroy } from '../with-destroy/with-destroy';
const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root',
})
export class AuthService extends WithDestroy {
  private userSubject = new ReplaySubject<LoggedUser>();
  user$ = this.userSubject.pipe();
  apiUrl = environment.api;
  constructor(
    public router: Router,
    private http: HttpClient,
    private store: Store
  ) {
    super();
  }

  signInWithGoogle() {
    const url = `${this.apiUrl}/${AUTH_ENDPOINTS.loginWithGoogle}`;
    window.open(url, '_self');
  }

  signInWithGithub() {
    const url = `${this.apiUrl}/${AUTH_ENDPOINTS.loginWithGithub}`;
    window.open(url, '_self');
  }

  singInWithUserCredentials(credentials: { email: string; password: string }) {
    const url = `${this.apiUrl}/${AUTH_ENDPOINTS.login}`;
    return this.http
      .post<LoggedUser>(url, credentials, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .pipe(
        tap((response) => {
          if (response) {
            this.store.dispatch(new SetLoggedInUser(response));
          }
        })
      );
  }

  signUpUser(user: User) {
    const url = `${this.apiUrl}/${AUTH_ENDPOINTS.signup}`;
    return this.http
      .post<LoggedUser>(url, user, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .pipe(
        tap((response) => {
          if (response) {
            this.store.dispatch(new SetLoggedInUser(response));
          }
        })
      );
  }

  getUserAssociatedWithToken(token: string) {
    if (!token) {
      return new Error('Provide valid token');
    }
    const tokenDecoded = this.decodeAccessToken(token);
    if (tokenDecoded) {
      const { sub } = tokenDecoded;
      return this.getUserWithId(sub);
    } else {
      return new Error('User token not valid!');
    }
  }

  updateUserLoginMethod(id: string, methods: { [key: string]: boolean }) {
    const url = `${this.apiUrl}/${AUTH_ENDPOINTS.updateMethod}`;
    return this.http.post<User>(url, methods);
  }

  private getUserWithId(id: string) {
    return this.http.get<User>(
      `${this.apiUrl}/${CARTELLA_ENDPOINTS.users}/${id}`
    );
  }

  private decodeAccessToken(token: string) {
    try {
      return helper.decodeToken(token);
    } catch (error) {
      return null;
    }
  }
}
