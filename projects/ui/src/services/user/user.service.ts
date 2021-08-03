import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CARTELLA_ENDPOINTS } from '../../../../../src/app/shared/config/endpoints.config';
import { User } from '../../../../../src/app/shared/interfaces/user.interface';
import { environment } from '../../../../../src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = `${environment.api}/${CARTELLA_ENDPOINTS.users}`;
  constructor(private http: HttpClient) {}

  updateUser(id: string, data: Partial<User>) {
    return this.http.put<User>(`${this.apiUrl}/${id}`, data);
  }
}
