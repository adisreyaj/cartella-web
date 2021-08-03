import { Component } from '@angular/core';
import { MenuService } from '@cartella/ui/services';

@Component({
  selector: 'app-profile',
  template: `
    <aside
      [ngClass]="(isMenuOpen$ | async) ? 'open' : 'close'"
      (swipedown)="closeMenu()"
      class="bg-gray-100 dark:bg-dark-500"
    >
      <app-profile-sidebar (menuClosed)="closeMenu()"></app-profile-sidebar>
    </aside>
    <main class="p-4 bg-white dark:bg-dark-800">
      <router-outlet></router-outlet>
    </main>
    <div *ngIf="isMenuOpen$ | async" (click)="closeMenu()" class="overlay"></div>
    <button
      class="fixed flex p-4 rounded-full bottom-4 right-4 bg-primary shadow-floating md:hidden default-ring"
      (click)="toggleMenu()"
    >
      <rmx-icon name="settings-line" class="text-white icon-3xl"></rmx-icon>
    </button>
  `,
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  isMenuOpen$ = this.menu.isMenuOpen$;
  constructor(private menu: MenuService) {}
  closeMenu() {
    this.menu.closeMenu();
  }
  toggleMenu() {
    this.menu.toggleMenu();
  }
}
