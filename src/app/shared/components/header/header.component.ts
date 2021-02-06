import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { User } from '@app/interfaces/user.interface';
import { LogoutUser } from '@app/store/actions/user.action';
import { UserState } from '@app/store/states/user.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  @Select(UserState.getLoggedInUser)
  user$: Observable<User>;
  constructor(private store: Store) {}

  ngOnInit(): void {}

  logout() {
    this.store.dispatch(new LogoutUser());
  }
}
