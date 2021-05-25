import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CleanupService } from '@cartella/services/cleanup/cleanup.service';
import { DarkModeService } from '@cartella/services/dark-mode/dark-mode.service';
import { MetaService } from '@cartella/services/meta/meta.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { filter, map, mergeMap } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  // To enable dark mode in auth pages
  constructor(
    public readonly dark: DarkModeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private metaService: MetaService,
    private config: NgSelectConfig,
    private cleanupService: CleanupService
  ) {
    this.config.appendTo = 'body';
  }
  ngOnInit(): void {
    // Cleanup local data
    this.cleanupService.cleanUpLocalSyncedData();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((event) => {
        this.metaService.updateTitle(event.title);
        this.metaService.updateOgUrl(event.ogUrl);
        this.metaService.updateDescription(event.description);
      });
  }
}
