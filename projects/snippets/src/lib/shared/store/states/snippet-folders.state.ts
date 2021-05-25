import { Injectable } from '@angular/core';
import { ALL_SNIPPETS_FOLDER } from '@cartella/config/snippets.config';
import { BaseStorageService } from '@cartella/services/storage/base-storage.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SnippetFolder } from '../../interfaces/snippets.interface';
import { SnippetsService } from '../../services/snippet/snippets.service';
import {
  AddSnippetFolder,
  DeleteSnippetFolder,
  GetSnippetFolders,
  SetActiveSnippetFolder,
  UpdateSnippetFolder,
} from '../actions/snippets-folders.action';

export class SnippetFolderStateModel {
  snippetFolders: SnippetFolder[] = [];
  activeSnippetFolder: SnippetFolder | null = null;
  fetched: boolean = false;
}
@State({
  name: 'snippetFolders',
  defaults: {
    snippetFolders: [],
    activeSnippetFolder: null,
    fetched: false,
  },
})
@Injectable()
export class SnippetFolderState {
  constructor(private snippetService: SnippetsService, private storage: BaseStorageService<SnippetFolder>) {}

  @Selector()
  static getAllSnippetFolders(state: SnippetFolderStateModel) {
    return state.snippetFolders;
  }

  @Selector()
  static getSnippetFolderFetched(state: SnippetFolderStateModel) {
    return state.fetched;
  }

  @Selector()
  static getActiveSnippetFolder(state: SnippetFolderStateModel) {
    return state.activeSnippetFolder;
  }

  @Action(GetSnippetFolders)
  getSnippetFolders({ getState, patchState, setState }: StateContext<SnippetFolderStateModel>) {
    const state = getState();
    if (state.fetched) {
      return this.storage.getItem('snippets').pipe(
        switchMap((snippetFolders) => {
          if (!snippetFolders) {
            return this.snippetService.getFolders().pipe(
              map(({ payload }) => payload),
              tap((result) => {
                patchState({
                  snippetFolders: result,
                });
              }),
            );
          } else {
            patchState({
              snippetFolders,
            });
            return of(snippetFolders);
          }
        }),
      );
    } else {
      return this.snippetService.getFolders().pipe(
        map(({ payload }) => payload),
        tap((result) => {
          setState({
            ...state,
            snippetFolders: result,
            fetched: true,
            activeSnippetFolder: ALL_SNIPPETS_FOLDER,
          });
        }),
      );
    }
  }

  @Action(AddSnippetFolder)
  addSnippet({ getState, patchState }: StateContext<SnippetFolderStateModel>, { payload }: AddSnippetFolder) {
    return this.snippetService.createNewFolder(payload).pipe(
      tap((result) => {
        const state = getState();
        patchState({
          snippetFolders: [...state.snippetFolders, result],
          activeSnippetFolder: result,
        });
      }),
    );
  }

  @Action(UpdateSnippetFolder)
  updateSnippet({ getState, setState }: StateContext<SnippetFolderStateModel>, { payload, id }: UpdateSnippetFolder) {
    return this.snippetService.updateFolder(id, payload).pipe(
      tap((result) => {
        const state = getState();
        const foldersList = [...state.snippetFolders];
        const folderIndex = foldersList.findIndex((item) => item.id === id);
        foldersList[folderIndex] = result;
        setState({
          ...state,
          snippetFolders: foldersList,
        });
      }),
    );
  }

  @Action(DeleteSnippetFolder)
  deleteSnippet({ getState, setState }: StateContext<SnippetFolderStateModel>, { id }: DeleteSnippetFolder) {
    return this.snippetService.deleteFolder(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.snippetFolders.filter((item) => item.id !== id);
        setState({
          ...state,
          snippetFolders: filteredArray,
        });
      }),
    );
  }

  @Action(SetActiveSnippetFolder, { cancelUncompleted: true })
  setSelectedSnippetId(
    { getState, setState }: StateContext<SnippetFolderStateModel>,
    { payload }: SetActiveSnippetFolder,
  ) {
    const state = getState();
    setState({
      ...state,
      activeSnippetFolder: payload,
    });
  }
}
