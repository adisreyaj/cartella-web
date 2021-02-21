import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DarkModeService } from '@app/services/dark-mode/dark-mode.service';
import { MetaService } from '@app/services/meta/meta.service';
import { filter, map, mergeMap } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // To enable dark mode in auth pages
  constructor(
    public readonly dark: DarkModeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private metaService: MetaService
  ) {}
  ngOnInit(): void {
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
