import { Component, OnInit } from '@angular/core';
import { MenuService } from '@app/services/menu/menu.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  isMenuOpen$: Observable<boolean>;
  constructor(private menu: MenuService) {}

  ngOnInit() {
    this.isMenuOpen$ = this.menu.isMenuOpen$;
  }

  closeMenu() {
    this.menu.closeMenu();
  }
  toggleMenu() {
    this.menu.toggleMenu();
  }
}
