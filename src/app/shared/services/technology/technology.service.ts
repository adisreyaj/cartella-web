import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CARTELLA_ENDPOINTS } from '@app/config/endpoints.config';
import { environment } from '@app/env/environment';
import { PayloadResponse } from '@app/interfaces/response.interface';
import { Technology } from '@app/interfaces/technology.interface';

@Injectable({
  providedIn: 'root',
})
export class TechnologyService {
  apiUrl = `${environment.api}/${CARTELLA_ENDPOINTS.technology}`;
  constructor(private http: HttpClient) {}

  getTechnologies() {
    return this.http.get<PayloadResponse<Technology>>(this.apiUrl);
  }
}
