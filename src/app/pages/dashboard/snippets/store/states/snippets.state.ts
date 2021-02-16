import { Injectable } from '@angular/core';
import { StorageFolders } from '@app/services/storage/storage.interface';
import { StorageService } from '@app/services/storage/storage.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Snippet } from '../../interfaces/snippets.interface';
import { SnippetsService } from '../../services/snippet/snippets.service';
import {
  AddSnippet,
  DeleteSnippet,
  GetSnippets,
  SetActiveSnippet,
  UpdateSnippet,
} from '../actions/snippets.action';

export class SnippetStateModel {
  allSnippets: Snippet[];
  snippetsShown: Snippet[];
  activeSnippet: Snippet;
  fetched: boolean;
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
  constructor(
    private snippetService: SnippetsService,
    private storage: StorageService
  ) {}

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
  getSnippets(
    { getState, setState, patchState }: StateContext<SnippetStateModel>,
    { id }: GetSnippets
  ) {
    switch (id) {
      case 'all':
        const state = getState();
        if (state.fetched) {
          return this.storage
            .getAllItems<Snippet>(StorageFolders.snippets)
            .pipe(
              switchMap((snippets) => {
                if (!snippets) {
                  return this.snippetService.getSnippets().pipe(
                    map(({ payload }) => payload),
                    tap((result) => {
                      patchState({
                        snippetsShown: result,
                      });
                    })
                  );
                } else {
                  patchState({
                    snippetsShown: snippets,
                  });
                  return of(snippets);
                }
              })
            );
        } else {
          return this.snippetService.getSnippets().pipe(
            map(({ payload }) => payload),
            tap((result) => {
              setState({
                ...state,
                fetched: true,
                allSnippets: result,
                snippetsShown: result,
              });
            })
          );
        }
      case 'starred':
        return this.snippetService.getFavoriteSnippets().pipe(
          map(({ payload }) => payload),
          tap((result) => {
            patchState({ snippetsShown: result });
          })
        );
      default: {
        return this.storage.getItem(StorageFolders.snippets, id).pipe(
          switchMap((snippets) => {
            if (!snippets) {
              return this.snippetService.getSnippetsInFolder(id).pipe(
                map(({ payload }) => payload),
                tap((result) => {
                  patchState({
                    snippetsShown: result,
                  });
                })
              );
            } else {
              patchState({
                snippetsShown: snippets,
              });
              return of(snippets);
            }
          })
        );
      }
    }
  }

  @Action(AddSnippet)
  addSnippet(
    { getState, patchState }: StateContext<SnippetStateModel>,
    { payload }: AddSnippet
  ) {
    return this.snippetService.createNewSnippet(payload).pipe(
      tap((result) => {
        const state = getState();
        patchState({
          allSnippets: [...state.allSnippets, result],
          snippetsShown: [...state.snippetsShown, result],
          activeSnippet: result,
        });
      })
    );
  }

  @Action(UpdateSnippet)
  updateSnippet(
    { getState, patchState }: StateContext<SnippetStateModel>,
    { payload, id }: UpdateSnippet
  ) {
    return this.snippetService.updateSnippet(id, payload).pipe(
      tap((result) => {
        const state = getState();
        const allSnippetList = [...state.allSnippets];
        const snippetIndex = allSnippetList.findIndex((item) => item.id === id);
        allSnippetList[snippetIndex] = result;
        const shownSnippetList = [...state.snippetsShown];
        const shownSnippetIndex = shownSnippetList.findIndex(
          (item) => item.id === id
        );
        shownSnippetList[shownSnippetIndex] = result;
        patchState({
          allSnippets: allSnippetList,
          snippetsShown: shownSnippetList,
        });
      })
    );
  }

  @Action(DeleteSnippet)
  deleteSnippet(
    { getState, patchState }: StateContext<SnippetStateModel>,
    { id }: DeleteSnippet
  ) {
    return this.snippetService.deleteSnippet(id).pipe(
      tap(() => {
        const state = getState();
        const filteredAllSnippets = state.allSnippets.filter(
          (item) => item.id !== id
        );
        const filteredVisibleSnippets = state.snippetsShown.filter(
          (item) => item.id !== id
        );
        patchState({
          allSnippets: filteredAllSnippets,
          snippetsShown: filteredVisibleSnippets,
        });
      })
    );
  }

  @Action(SetActiveSnippet, { cancelUncompleted: true })
  setSelectedSnippet(
    { getState, patchState }: StateContext<SnippetStateModel>,
    { payload }: SetActiveSnippet
  ) {
    if (payload) {
      const state = getState();
      if (
        !state.activeSnippet ||
        (state.activeSnippet && state.activeSnippet.id !== payload.id)
      ) {
        patchState({
          activeSnippet: payload,
        });
        return this.snippetService.updateViews(payload.id);
      }
    }
  }
}
