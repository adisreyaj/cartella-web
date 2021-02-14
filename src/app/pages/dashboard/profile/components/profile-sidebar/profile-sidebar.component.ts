import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSidebarComponent {
  @Output() menuClosed = new EventEmitter<void>();
  closeMenu() {
    this.menuClosed.emit();
  }
}
