import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { ConfigurationService } from '@cartella/services/configuration/configuration.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeatureGuard implements CanLoad {
  constructor(private configService: ConfigurationService, private router: Router) {}
  canLoad(
    route: Route,
    _: UrlSegment[],
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const { data } = route;
    if (data && data.feature) {
      const { feature } = data;
      if (feature) {
        const isEnabled = this.configService.isFeatureEnabled(`modules.${feature}.enabled`);
        if (isEnabled) {
          return true;
        }
      }
    }
    this.router.navigate(['/']);
    return false;
  }
}
