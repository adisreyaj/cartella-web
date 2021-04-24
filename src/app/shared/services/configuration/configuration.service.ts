import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CARTELLA_ENDPOINTS } from '@cartella/config/endpoints.config';
import { environment } from '@cartella/env/environment';
import { FeatureConfiguration } from '@cartella/interfaces/configuration.interface';
import { get, has } from 'lodash-es';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  config: FeatureConfiguration = null;
  configUrl = `${environment.api}/${CARTELLA_ENDPOINTS.config}`;

  constructor(private http: HttpClient) {}

  loadConfig() {
    return this.http
      .get<FeatureConfiguration>(this.configUrl)
      .pipe(tap((data) => (this.config = data)))
      .toPromise();
  }

  isFeatureEnabled(key: string) {
    if (this.config && has(this.config, key)) {
      return get(this.config, key, false);
    }
  }
}
