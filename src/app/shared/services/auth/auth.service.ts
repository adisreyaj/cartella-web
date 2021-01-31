import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
  AUTH_ENDPOINTS,
  CARTELLA_ENDPOINTS,
} from '@app/config/endpoints.config';
import { LoggedUser, User } from '@app/interfaces/user.interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  user: LoggedUser;

  private userSubject = new ReplaySubject<LoggedUser>();
  user$ = this.userSubject.pipe();
  apiUrl = environment.api;
  private subs = new SubSink();
  constructor(public router: Router, private http: HttpClient) {}

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  login(email: string, password: string) {
    this.router.navigate(['/']);
  }
  register(email: string, password: string) {}

  logout() {
    localStorage.removeItem('user');
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
            this.user = response;
            this.userSubject.next(response);
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
            this.userSubject.next(response);
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
    } else return new Error('User token not valid!');
  }

  getUserWithId(id: string) {
    return this.http.get(`${this.apiUrl}/${CARTELLA_ENDPOINTS.users}/${id}`);
  }

  decodeAccessToken(token: string) {
    try {
      return helper.decodeToken(token);
    } catch (error) {
      return null;
    }
  }

  setLoggedInUser(user: LoggedUser) {
    this.user = user;
    this.userSubject.next(user);
  }
}
