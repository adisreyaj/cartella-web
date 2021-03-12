import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@app/env/environment';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class DelayApiInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next
      .handle(request)
      .pipe(
        delay(environment.production && request.method !== 'GET' ? 0 : 1000)
      );
  }
}
