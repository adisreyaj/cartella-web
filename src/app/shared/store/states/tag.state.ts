import { Injectable } from '@angular/core';
import { Tag } from '@app/interfaces/tag.interface';
import { TagService } from '@app/services/tag/tag.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { GetCustomTags } from '../actions/tag.action';

export class TagStateModel {
  customTags: Tag[];
}

@State({
  name: 'tags',
})
@Injectable()
export class TagState {
  constructor(private tagService: TagService) {}

  @Selector()
  static getCustomTagsList(state: TagStateModel) {
    return state.customTags;
  }

  @Action(GetCustomTags)
  getTags({ getState, setState }: StateContext<TagStateModel>) {
    return this.tagService.getCustomTags().pipe(
      map(({ payload }) => payload),
      tap((result) => {
        const state = getState();
        setState({
          ...state,
          customTags: result,
        });
      })
    );
  }
}
