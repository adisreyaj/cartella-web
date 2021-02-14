import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  isMenuOpen = false;
  private isMenuOpeSubject = new BehaviorSubject(this.isMenuOpen);
  isMenuOpen$ = this.isMenuOpeSubject.pipe(
    tap((data) => (this.isMenuOpen = data))
  );
  constructor() {}

  toggleMenu() {
    this.isMenuOpeSubject.next(!this.isMenuOpen);
  }

  closeMenu() {
    this.isMenuOpeSubject.next(false);
  }
}
