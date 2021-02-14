import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '@app/services/menu/menu.service';
import { GetCustomTags } from '@app/store/actions/tag.action';
import { GetTechnologies } from '@app/store/actions/technology.action';
import { GetLoggedInUser } from '@app/store/actions/user.action';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isMenuOpen$: Observable<boolean>;
  constructor(
    private store: Store,
    private router: Router,
    public menu: MenuService
  ) {}

  ngOnInit(): void {
    this.isMenuOpen$ = this.menu.isMenuOpen$;
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
        this.router.navigate(['/auth/login']);
      }
    );
  }

  private getTechnologies() {
    this.store.dispatch(new GetTechnologies());
  }
  private getCustomTags() {
    this.store.dispatch(new GetCustomTags());
  }
}
