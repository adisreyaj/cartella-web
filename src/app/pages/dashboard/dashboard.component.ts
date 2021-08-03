import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '@cartella/config/routes.config';
import { GetCustomTags } from '@cartella/store/actions/tag.action';
import { GetTechnologies } from '@cartella/store/actions/technology.action';
import { GetLoggedInUser } from '@cartella/store/actions/user.action';
import { MenuService } from '@cartella/ui/services';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isMenuOpen$ = this.menu.isMenuOpen$;
  constructor(private store: Store, private router: Router, public menu: MenuService) {}

  ngOnInit(): void {
    this.getLoggedUserDetails();
    this.getTechnologies();
    this.getCustomTags();
  }

  toggleMenu() {
    this.menu.toggleMenu();
  }

  private getLoggedUserDetails() {
    this.store.dispatch(new GetLoggedInUser()).subscribe(
      () => {},
      () => {
        this.router.navigate([ROUTES.auth.root, ROUTES.auth.login]);
      },
    );
  }

  private getTechnologies() {
    this.store.dispatch(new GetTechnologies());
  }
  private getCustomTags() {
    this.store.dispatch(new GetCustomTags());
  }
}
