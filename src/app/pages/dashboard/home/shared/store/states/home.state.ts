import { Injectable } from '@angular/core';
import { BaseStorageService } from '@app/services/storage/base-storage.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { HomeItemCounts } from '../../interfaces/home.interface';
import { HomeService } from '../../services/home.service';
import { GetCounts, GetLatestItems, GetTopItems } from '../actions/home.action';

export class HomeStateModel {
  latest: any[];
  top: any[];
  latestUpdatedAt: Date;
  topUpdatedAt: Date;
  counts: HomeItemCounts;
  countsFetched = false;
}
@State({
  name: 'home',
})
@Injectable()
export class HomeState {
  constructor(
    private homeService: HomeService,
    private storage: BaseStorageService
  ) {}
  @Selector()
  static getLatestItemsLastUpdated(state: HomeStateModel) {
    return state.latestUpdatedAt;
  }
  @Selector()
  static getTopItemsLastUpdated(state: HomeStateModel) {
    return state.topUpdatedAt;
  }
  @Selector()
  static getLatestItems(state: HomeStateModel) {
    return state.latest;
  }

  @Selector()
  static getTopItems(state: HomeStateModel) {
    return state.top;
  }
  @Selector()
  static getItemsCount(state: HomeStateModel) {
    return { items: state.counts, fetched: state.countsFetched };
  }

  @Action(GetTopItems)
  getTopItems({ getState, setState }: StateContext<HomeStateModel>) {
    return this.homeService.getTopItemsInAllCategories().pipe(
      tap((result) => {
        const state = getState();
        setState({
          ...state,
          top: result,
          topUpdatedAt: new Date(),
        });
      })
    );
  }
  @Action(GetCounts)
  getCounts({ getState, setState }: StateContext<HomeStateModel>) {
    return this.homeService.getItemsCount().pipe(
      tap((result) => {
        const state = getState();
        setState({
          ...state,
          counts: result,
          countsFetched: true,
        });
        this.storage.setItem('count', result);
      })
    );
  }

  @Action(GetLatestItems)
  getLatestItems({ getState, setState }: StateContext<HomeStateModel>) {
    return this.homeService.getLatestItemsInAllCategories().pipe(
      tap((result) => {
        const state = getState();
        setState({
          ...state,
          latest: result,
          latestUpdatedAt: new Date(),
        });
      })
    );
  }
}
