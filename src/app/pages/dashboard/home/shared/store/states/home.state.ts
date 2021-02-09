import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { HomeService } from '../../services/home.service';
import { GetLatestItems, GetTopItems } from '../actions/home.action';

export class HomeStateModel {
  latest: any[];
  top: any[];
  latestUpdatedAt: Date;
  topUpdatedAt: Date;
}
@State({
  name: 'home',
})
@Injectable()
export class HomeState {
  constructor(private homeService: HomeService) {}
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
