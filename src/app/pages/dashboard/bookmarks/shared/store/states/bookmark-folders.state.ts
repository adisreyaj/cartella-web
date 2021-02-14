import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { BookmarkFolder } from '../../interfaces/bookmarks.interface';
import { BookmarksService } from '../../services/bookmarks.service';
import {
  AddBookmarkFolder,
  DeleteBookmarkFolder,
  GetBookmarkFolders,
  SetActiveBookmarkFolder,
  UpdateBookmarkFolder,
} from '../actions/bookmark-folders.action';

export class BookmarkFolderStateModel {
  bookmarkFolders: BookmarkFolder[];
  fetched: boolean;
  activeBookmarkFolder: BookmarkFolder;
}
@State({
  name: 'bookmarkFolders',
  defaults: {
    bookmarkFolders: [],
    fetched: false,
    activeBookmarkFolder: null,
  },
})
@Injectable()
export class BookmarkFolderState {
  constructor(private bookmarkService: BookmarksService) {}

  @Selector()
  static getBookmarkFoldersList(state: BookmarkFolderStateModel) {
    return state.bookmarkFolders;
  }

  @Selector()
  static getBookmarkFolderFetched(state: BookmarkFolderStateModel) {
    return state.fetched;
  }
  @Selector()
  static getActiveBookmarkFolder(state: BookmarkFolderStateModel) {
    return state.activeBookmarkFolder;
  }

  @Action(GetBookmarkFolders)
  getBookmarkFolders({
    getState,
    setState,
  }: StateContext<BookmarkFolderStateModel>) {
    return this.bookmarkService.getFolders().pipe(
      map(({ payload }) => payload),
      tap((result) => {
        const state = getState();
        setState({
          ...state,
          bookmarkFolders: result,
          fetched: true,
        });
      })
    );
  }

  @Action(AddBookmarkFolder)
  addBookmark(
    { getState, patchState }: StateContext<BookmarkFolderStateModel>,
    { payload }: AddBookmarkFolder
  ) {
    return this.bookmarkService.createNewFolder(payload).pipe(
      tap((result) => {
        const state = getState();
        patchState({
          bookmarkFolders: [...state.bookmarkFolders, result],
          activeBookmarkFolder: result,
        });
      })
    );
  }

  @Action(UpdateBookmarkFolder)
  updateBookmark(
    { getState, setState }: StateContext<BookmarkFolderStateModel>,
    { payload, id }: UpdateBookmarkFolder
  ) {
    return this.bookmarkService.updateFolder(id, payload).pipe(
      tap((result) => {
        const state = getState();
        const foldersList = [...state.bookmarkFolders];
        const folderIndex = foldersList.findIndex((item) => item.id === id);
        foldersList[folderIndex] = result;
        setState({
          ...state,
          bookmarkFolders: foldersList,
        });
      })
    );
  }

  @Action(DeleteBookmarkFolder)
  deleteBookmark(
    { getState, setState }: StateContext<BookmarkFolderStateModel>,
    { id }: DeleteBookmarkFolder
  ) {
    return this.bookmarkService.deleteFolder(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.bookmarkFolders.filter(
          (item) => item.id !== id
        );
        setState({
          ...state,
          bookmarkFolders: filteredArray,
        });
      })
    );
  }

  @Action(SetActiveBookmarkFolder, { cancelUncompleted: true })
  setSelectedBookmark(
    { getState, setState }: StateContext<BookmarkFolderStateModel>,
    { payload }: SetActiveBookmarkFolder
  ) {
    const state = getState();
    setState({
      ...state,
      activeBookmarkFolder: payload,
    });
  }
}
