import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
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
  snippetFolders: SnippetFolder[];
  activeSnippetFolder: SnippetFolder;
}
@State({
  name: 'snippetFolders',
})
@Injectable()
export class SnippetFolderState {
  constructor(private snippetService: SnippetsService) {}

  @Selector()
  static getSnippetFoldersList(state: SnippetFolderStateModel) {
    return state.snippetFolders;
  }

  @Selector()
  static getActiveSnippetFolder(state: SnippetFolderStateModel) {
    return state.activeSnippetFolder;
  }

  @Action(GetSnippetFolders)
  getSnippetFolders({
    getState,
    setState,
  }: StateContext<SnippetFolderStateModel>) {
    return this.snippetService.getFolders().pipe(
      map(({ payload }) => payload),
      tap((result) => {
        const state = getState();
        setState({
          ...state,
          snippetFolders: result,
        });
      })
    );
  }

  @Action(AddSnippetFolder)
  addSnippet(
    { getState, patchState }: StateContext<SnippetFolderStateModel>,
    { payload }: AddSnippetFolder
  ) {
    return this.snippetService.createNewFolder(payload).pipe(
      tap((result) => {
        const state = getState();
        patchState({
          snippetFolders: [...state.snippetFolders, result],
        });
      })
    );
  }

  @Action(UpdateSnippetFolder)
  updateSnippet(
    { getState, setState }: StateContext<SnippetFolderStateModel>,
    { payload, id }: UpdateSnippetFolder
  ) {
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
      })
    );
  }

  @Action(DeleteSnippetFolder)
  deleteSnippet(
    { getState, setState }: StateContext<SnippetFolderStateModel>,
    { id }: DeleteSnippetFolder
  ) {
    return this.snippetService.deleteFolder(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.snippetFolders.filter(
          (item) => item.id !== id
        );
        setState({
          ...state,
          snippetFolders: filteredArray,
        });
      })
    );
  }

  @Action(SetActiveSnippetFolder)
  setSelectedSnippetId(
    { getState, setState }: StateContext<SnippetFolderStateModel>,
    { payload }: SetActiveSnippetFolder
  ) {
    const state = getState();
    setState({
      ...state,
      activeSnippetFolder: payload,
    });
  }
}
