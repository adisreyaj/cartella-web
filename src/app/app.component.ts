import { Component } from '@angular/core';
import { DarkModeService } from '@app/services/dark-mode/dark-mode.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // To enable dark mode in auth pages
  constructor(private dark: DarkModeService) {}
}
