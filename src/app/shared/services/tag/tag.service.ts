import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CARTELLA_ENDPOINTS } from '@app/config/endpoints.config';
import { PayloadResponse } from '@app/interfaces/response.interface';
import { Tag } from '@app/interfaces/tag.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  apiUrl = `${environment.api}/${CARTELLA_ENDPOINTS.tags}`;
  constructor(private http: HttpClient) {}

  getCustomTags() {
    return this.http.get<PayloadResponse<Tag>>(`${this.apiUrl}/custom`);
  }
}
