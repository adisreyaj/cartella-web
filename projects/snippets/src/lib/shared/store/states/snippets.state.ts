import { Injectable } from '@angular/core';
import { BaseStorageService } from '@cartella/services/storage/base-storage.service';
import { Action, Selector, State, StateContext, StateOperator } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { of, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Snippet } from '../../interfaces/snippets.interface';
import { SnippetsService } from '../../services/snippet/snippets.service';
import {
  AddSnippet,
  DeleteSnippet,
  GetSnippets,
  SetActiveSnippet,
  SetActiveSnippetWithSlug,
  ShareSnippet,
  UnShareSnippet,
  UpdateSharePreferencesSnippet,
  UpdateSnippet,
} from '../actions/snippets.action';

export class SnippetStateModel {
  allSnippets: Snippet[] = [];
  snippetsShown: Snippet[] = [];
  activeSnippet: Snippet | undefined = undefined;
  fetched = false;
}
@State({
  name: 'snippets',
  defaults: {
    allSnippets: [],
    snippetsShown: [],
    activeSnippet: null,
    fetched: false,
  },
})
@Injectable()
export class SnippetState {
  constructor(private snippetService: SnippetsService, private storage: BaseStorageService<Snippet>) {}

  @Selector()
  static getAllSnippets(state: SnippetStateModel) {
    return state.allSnippets;
  }

  @Selector()
  static getSnippetFetched(state: SnippetStateModel) {
    return state.fetched;
  }

  @Selector()
  static getSnippetsShown(state: SnippetStateModel) {
    return state.snippetsShown;
  }

  @Selector()
  static getActiveSnippet(state: SnippetStateModel) {
    return state.activeSnippet;
  }

  @Action(GetSnippets, { cancelUncompleted: true })
  getSnippets({ getState, patchState }: StateContext<SnippetStateModel>, { id }: GetSnippets) {
    switch (id) {
      case 'all':
        const state = getState();
        if (state.fetched) {
          return this.storage.getAllItemsFromUserFolder().pipe(
            switchMap((snippets) => {
              if (!snippets) {
                return this.snippetService.getSnippets().pipe(
                  map(({ payload }) => payload),
                  tap((result) => {
                    patchState({
                      snippetsShown: result,
                    });
                  }),
                );
              } else {
                patchState({
                  snippetsShown: snippets,
                });
                return of(snippets);
              }
            }),
          );
        } else {
          return this.snippetService.getSnippets().pipe(
            map(({ payload }) => payload),
            tap((result) => {
              patchState({
                fetched: true,
                allSnippets: result,
                snippetsShown: result,
              });
            }),
          );
        }
      case 'starred':
        return this.storage.getItem(id).pipe(
          switchMap((snippets) => {
            if (!snippets) {
              return this.snippetService.getFavoriteSnippets().pipe(
                map(({ payload }) => payload),
                tap((result) => {
                  patchState({ snippetsShown: result });
                }),
              );
            } else {
              patchState({
                snippetsShown: snippets,
              });
              return of(snippets);
            }
          }),
        );
      default: {
        return this.storage.getItem(id).pipe(
          switchMap((snippets) => {
            if (!snippets) {
              return this.snippetService.getSnippetsInFolder(id).pipe(
                map(({ payload }) => payload),
                tap((result) => {
                  patchState({
                    snippetsShown: result,
                  });
                }),
              );
            } else {
              patchState({
                snippetsShown: snippets,
              });
              return of(snippets);
            }
          }),
        );
      }
    }
  }

  @Action(AddSnippet)
  addSnippet({ setState }: StateContext<SnippetStateModel>, { payload }: AddSnippet) {
    return this.snippetService.createNewSnippet(payload).pipe(
      tap((result) => {
        setState(
          patch({
            allSnippets: append([result]),
            snippetsShown: append([result]),
            activeSnippet: result,
          }),
        );
      }),
    );
  }

  @Action(UpdateSnippet)
  updateSnippet({ setState }: StateContext<SnippetStateModel>, { payload, id }: UpdateSnippet) {
    return this.snippetService.updateSnippet(id, payload).pipe(
      tap((result) => {
        const stateToPatch = this.getUpdatedSnippetsState(id, result);
        setState(stateToPatch);
      }),
    );
  }

  @Action(DeleteSnippet)
  deleteSnippet({ setState }: StateContext<SnippetStateModel>, { id }: DeleteSnippet) {
    return this.snippetService.deleteSnippet(id).pipe(
      tap(() => {
        setState(
          patch({
            allSnippets: removeItem<Snippet>((item) => item?.id === id),
            snippetsShown: removeItem<Snippet>((item) => item?.id === id),
          }),
        );
      }),
    );
  }

  @Action(SetActiveSnippet, { cancelUncompleted: true })
  setSelectedSnippet({ getState, patchState }: StateContext<SnippetStateModel>, { payload }: SetActiveSnippet) {
    if (payload) {
      const state = getState();
      if (!state.activeSnippet || (state.activeSnippet && state.activeSnippet.id !== payload.id)) {
        patchState({
          activeSnippet: payload,
        });
        return this.snippetService.updateViews(payload.id);
      }
    }
  }
  @Action(SetActiveSnippetWithSlug, { cancelUncompleted: true })
  setActiveSnippetWithSlug(
    { getState, patchState }: StateContext<SnippetStateModel>,
    { payload }: SetActiveSnippetWithSlug,
  ) {
    if (payload) {
      const state = getState();
      const allSnippets = state.allSnippets;
      const selectedSnippet = allSnippets.find(({ slug }) => slug === payload);
      if (selectedSnippet) {
        patchState({
          activeSnippet: selectedSnippet,
        });
        return this.snippetService.updateViews(selectedSnippet.id);
      }
      return throwError(new Error('Failed to get snippet by slug'));
    }
  }

  @Action(ShareSnippet)
  shareSnippet({ setState }: StateContext<SnippetStateModel>, { id, shareTo }: ShareSnippet) {
    return this.snippetService.share(id, shareTo).pipe(
      tap((result) => {
        const stateToPatch = this.getUpdatedSnippetsState(id, result);
        setState(stateToPatch);
      }),
    );
  }

  @Action(UnShareSnippet)
  unShareSnippet({ setState }: StateContext<SnippetStateModel>, { id, revoke }: UnShareSnippet) {
    return this.snippetService.unShare(id, revoke).pipe(
      tap((result) => {
        const stateToPatch = this.getUpdatedSnippetsState(id, result);
        setState(stateToPatch);
      }),
    );
  }
  @Action(UpdateSharePreferencesSnippet)
  updateSharePref({ setState }: StateContext<SnippetStateModel>, { id, shareTo }: UpdateSharePreferencesSnippet) {
    return this.snippetService.updateSharePref(id, shareTo).pipe(
      tap((result) => {
        const stateToPatch = this.getUpdatedSnippetsState(id, result);
        setState(stateToPatch);
      }),
    );
  }

  private getUpdatedSnippetsState(id: string, result: Snippet): StateOperator<SnippetStateModel> {
    return patch({
      allSnippets: updateItem((item) => item?.id === id, result),
      snippetsShown: updateItem((item) => item?.id === id, result),
    });
  }
}
