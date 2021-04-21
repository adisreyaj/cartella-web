import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CARTELLA_ENDPOINTS } from '../../config/endpoints.config';
import { FeatureType } from '../../interfaces/general.interface';
import { ShareTo } from '../../interfaces/share.interface';

@Injectable({
  providedIn: 'root',
})
export class SharePopupService {
  baseUrl = environment.api;
  constructor(private http: HttpClient) {}

  share(id: string, list: ShareTo[], entity: FeatureType) {
    const entityEndpoint = `${entity.toLowerCase()}s`;
    const url = `${this.baseUrl}/${CARTELLA_ENDPOINTS[entityEndpoint]}/${id}/share`;
    return this.http.put(url, { shareTo: list });
  }
}
