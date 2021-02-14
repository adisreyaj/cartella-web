import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/interfaces/user.interface';
import { MenuService } from '@app/services/menu/menu.service';
import { LogoutUser } from '@app/store/actions/user.action';
import { UserState } from '@app/store/states/user.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  @Select(UserState.getLoggedInUser)
  user$: Observable<User>;

  isMenuOpen$: Observable<boolean>;
  constructor(
    private store: Store,
    private router: Router,
    private menu: MenuService
  ) {}

  ngOnInit(): void {
    this.isMenuOpen$ = this.menu.isMenuOpen$;
  }

  logout() {
    this.store
      .dispatch(new LogoutUser())
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['/auth/login']);
      });
  }

  toggleMenu() {
    this.menu.toggleMenu();
  }

  closeMenu() {
    this.menu.closeMenu();
  }
}
