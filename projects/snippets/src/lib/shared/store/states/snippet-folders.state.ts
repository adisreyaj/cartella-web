import { Injectable } from '@angular/core';
import { ALL_SNIPPETS_FOLDER } from '@cartella/config/snippets.config';
import { BaseStorageService } from '@cartella/ui/services';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
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
  activeSnippetFolder: SnippetFolder | undefined = undefined;
  fetched: boolean = false;
}
@State({
  name: 'snippetFolders',
  defaults: {
    snippetFolders: [],
    activeSnippetFolder: undefined,
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
  getSnippetFolders({ getState, patchState }: StateContext<SnippetFolderStateModel>) {
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
          patchState({
            snippetFolders: result,
            fetched: true,
            activeSnippetFolder: ALL_SNIPPETS_FOLDER,
          });
        }),
      );
    }
  }

  @Action(AddSnippetFolder)
  addSnippet({ setState }: StateContext<SnippetFolderStateModel>, { payload }: AddSnippetFolder) {
    return this.snippetService.createNewFolder(payload).pipe(
      tap((result) => {
        setState(
          patch({
            snippetFolders: append([result]),
            activeSnippetFolder: result,
          }),
        );
      }),
    );
  }

  @Action(UpdateSnippetFolder)
  updateSnippet({ setState }: StateContext<SnippetFolderStateModel>, { payload, id }: UpdateSnippetFolder) {
    return this.snippetService.updateFolder(id, payload).pipe(
      tap((result) => {
        setState(
          patch({
            snippetFolders: updateItem((item) => item?.id === id, result),
          }),
        );
      }),
    );
  }

  @Action(DeleteSnippetFolder)
  deleteSnippet({ setState }: StateContext<SnippetFolderStateModel>, { id }: DeleteSnippetFolder) {
    return this.snippetService.deleteFolder(id).pipe(
      tap(() => {
        setState(
          patch({
            snippetFolders: removeItem<SnippetFolder>((item) => item?.id !== id),
          }),
        );
      }),
    );
  }

  @Action(SetActiveSnippetFolder, { cancelUncompleted: true })
  setSelectedSnippetId({ patchState }: StateContext<SnippetFolderStateModel>, { payload }: SetActiveSnippetFolder) {
    patchState({
      activeSnippetFolder: payload,
    });
  }
}
