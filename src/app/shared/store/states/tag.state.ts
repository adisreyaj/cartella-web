import { Injectable } from '@angular/core';
import { Tag } from '@cartella/interfaces/tag.interface';
import { TagService } from '@cartella/services/tag/tag.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { AddTag, DeleteTag, GetCustomTags, UpdateTag } from '../actions/tag.action';

export class TagStateModel {
  customTags: Tag[] = [];
  defaultTags: Tag[] = [];
}

@State({
  name: 'tags',
  defaults: {
    customTags: [],
    defaultTags: [],
  },
})
@Injectable()
export class TagState {
  constructor(private tagService: TagService) {}

  @Selector()
  static getTagsList(state: TagStateModel) {
    return [...state.customTags, ...state.defaultTags];
  }
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
      }),
    );
  }

  @Action(AddTag)
  addTag({ getState, patchState }: StateContext<TagStateModel>, { payload }: AddTag) {
    return this.tagService.createNewTag(payload).pipe(
      tap((result) => {
        const state = getState();
        patchState({
          customTags: [...state.customTags, result],
        });
      }),
    );
  }

  @Action(UpdateTag)
  updateTag({ getState, setState }: StateContext<TagStateModel>, { payload, id }: UpdateTag) {
    return this.tagService.updateTag(id, payload).pipe(
      tap((result) => {
        const state = getState();
        const tagsList = [...state.customTags];
        const updateTagIndex = tagsList.findIndex((item) => item.id === id);
        tagsList[updateTagIndex] = result;
        setState({
          ...state,
          customTags: tagsList,
        });
      }),
    );
  }

  @Action(DeleteTag)
  deleteTag({ getState, setState }: StateContext<TagStateModel>, { id }: DeleteTag) {
    return this.tagService.deleteTag(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.customTags.filter((item) => item.id !== id);
        setState({
          ...state,
          customTags: filteredArray,
        });
      }),
    );
  }
}
