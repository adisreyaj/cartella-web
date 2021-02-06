import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { User } from '@app/interfaces/user.interface';
import { UserState } from '@app/store/states/user.state';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  @Select(UserState.getLoggedInUser)
  user$: Observable<User>;
  constructor() {}

  ngOnInit(): void {}
}
