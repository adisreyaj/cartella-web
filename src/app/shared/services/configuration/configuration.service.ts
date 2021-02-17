import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CARTELLA_ENDPOINTS } from '@app/config/endpoints.config';
import { FeatureConfiguration } from '@app/interfaces/configuration.interface';
import { has } from 'lodash-es';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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
      .pipe(
        tap((data) => (this.config = data)),
        tap(console.log)
      )
      .toPromise();
  }

  isFeatureEnabled(key: string) {
    if (this.config && has(this.config, key)) {
      return this.config[key];
    }
  }
}
