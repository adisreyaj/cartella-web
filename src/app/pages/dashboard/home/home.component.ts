import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { User } from '@app/interfaces/user.interface';
import { UserState } from '@app/store/states/user.state';
import { Select, Store } from '@ngxs/store';
import dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { HOME_ITEMS_EXPIRY } from './shared/config/home.config';
import { HomeItemCounts } from './shared/interfaces/home.interface';
import {
  GetCounts,
  GetLatestItems,
  GetTopItems,
} from './shared/store/actions/home.action';
import { HomeState } from './shared/store/states/home.state';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  @Select(UserState.getLoggedInUser)
  user$: Observable<User>;
  @Select(HomeState.getItemsCount)
  counts$: Observable<{ items: HomeItemCounts; fetched: boolean }>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.checkAndGetItems();
    this.store.dispatch(new GetCounts());
  }

  checkAndGetItems() {
    const latestUpdatedTime = this.store.selectSnapshot(
      HomeState.getLatestItemsLastUpdated
    );
    const topUpdatedTime = this.store.selectSnapshot(
      HomeState.getTopItemsLastUpdated
    );

    const isLatestDataStale = this.checkIfStale(latestUpdatedTime);
    const isTopDataStale = this.checkIfStale(topUpdatedTime);

    if (isLatestDataStale) {
      this.store.dispatch(new GetLatestItems());
    }
    if (isTopDataStale) {
      this.store.dispatch(new GetTopItems());
    }
  }

  private checkIfStale(date: Date) {
    const currentTime = dayjs();
    if (!date) {
      return true;
    }
    return (
      date &&
      dayjs(date).add(HOME_ITEMS_EXPIRY.value, HOME_ITEMS_EXPIRY.unit) <=
        currentTime
    );
  }
}
