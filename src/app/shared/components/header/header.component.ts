import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
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
  isDarkMode = false;

  isMenuOpen$: Observable<boolean>;
  constructor(
    private store: Store,
    private router: Router,
    private menu: MenuService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.isMenuOpen$ = this.menu.isMenuOpen$;
    if (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      this.enableDarkMode();
    } else {
      this.enableLightMode();
    }
  }

  get bodyElement() {
    return this.document.querySelector('body');
  }

  toggleTheme() {
    if (this.isDarkMode) {
      this.enableLightMode();
    } else {
      this.enableDarkMode();
    }
  }

  private enableDarkMode() {
    this.bodyElement.classList.add('mode-dark');
    this.isDarkMode = true;
    localStorage.setItem('theme', 'dark');
  }
  private enableLightMode() {
    this.bodyElement.classList.remove('mode-dark');
    this.isDarkMode = false;
    localStorage.setItem('theme', 'light');
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
