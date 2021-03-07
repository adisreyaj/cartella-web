import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  resetEndpoint = `${environment.api}/auth/reset`;
  verifyEndpoint = `${environment.api}/auth/change-password`;
  constructor(private http: HttpClient) {}

  generateOTP(email: string) {
    return this.http.post(this.resetEndpoint, { email });
  }

  changePassword(data: { email: string; otp: string; password: string }) {
    return this.http.post(this.verifyEndpoint, data);
  }
}
