import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@cartella/interfaces/user.interface';
import { CleanupService } from '@cartella/services/cleanup/cleanup.service';
import { DarkModeService } from '@cartella/services/dark-mode/dark-mode.service';
import { MenuService } from '@cartella/services/menu/menu.service';
import { LogoutUser } from '@cartella/store/actions/user.action';
import { UserState } from '@cartella/store/states/user.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Select(UserState.getLoggedInUser)
  user$: Observable<User>;
  isDarkMode$: Observable<boolean>;
  isMenuOpen$: Observable<boolean>;

  private subs = new SubSink();
  constructor(
    private store: Store,
    private router: Router,
    private menu: MenuService,
    private darkMode: DarkModeService,
    private cleanupService: CleanupService
  ) {}

  ngOnInit(): void {
    this.isMenuOpen$ = this.menu.isMenuOpen$;
    this.isDarkMode$ = this.darkMode.isDarkMode$;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  toggleDarkMode() {
    this.darkMode.toggle();
  }

  logout() {
    this.subs.add(
      this.store
        .dispatch(new LogoutUser())
        .pipe(take(1))
        .subscribe(() => {
          this.cleanupService.cleanUpLocalSyncedData();
          this.router.navigate(['/auth/login']);
        })
    );
  }

  toggleMenu() {
    this.menu.toggleMenu();
  }

  closeMenu() {
    this.menu.closeMenu();
  }
}
