import { Injectable } from '@angular/core';
import { BaseStorageService } from '@cartella/services/storage/base-storage.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ALL_BOOKMARKS_FOLDER } from '../../config/bookmarks.config';
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
  bookmarkFolders: BookmarkFolder[] = [];
  fetched = false;
  activeBookmarkFolder: BookmarkFolder | null = null;
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
  constructor(private bookmarkService: BookmarksService, private storage: BaseStorageService<BookmarkFolder>) {}

  @Selector()
  static getAllBookmarkFolders(state: BookmarkFolderStateModel) {
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
  getBookmarkFolders({ getState, setState, patchState }: StateContext<BookmarkFolderStateModel>) {
    const state = getState();
    if (state.fetched) {
      return this.storage.getItem('folders').pipe(
        switchMap((bookmarkFolders) => {
          if (!bookmarkFolders) {
            return this.bookmarkService.getFolders().pipe(
              map(({ payload }) => payload),
              tap((result) => {
                patchState({
                  bookmarkFolders: result,
                });
              }),
            );
          } else {
            patchState({
              bookmarkFolders,
            });
            return of(bookmarkFolders);
          }
        }),
      );
    } else {
      return this.bookmarkService.getFolders().pipe(
        map(({ payload }) => payload),
        tap((result) => {
          setState({
            ...state,
            bookmarkFolders: result,
            fetched: true,
            activeBookmarkFolder: ALL_BOOKMARKS_FOLDER,
          });
        }),
      );
    }
  }

  @Action(AddBookmarkFolder)
  addBookmarkFolder({ getState, patchState }: StateContext<BookmarkFolderStateModel>, { payload }: AddBookmarkFolder) {
    return this.bookmarkService.createNewFolder(payload).pipe(
      tap((result) => {
        const state = getState();
        patchState({
          bookmarkFolders: [...state.bookmarkFolders, result],
          activeBookmarkFolder: result,
        });
      }),
    );
  }

  @Action(UpdateBookmarkFolder)
  updateBookmarkFolder(
    { getState, setState }: StateContext<BookmarkFolderStateModel>,
    { payload, id }: UpdateBookmarkFolder,
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
      }),
    );
  }

  @Action(DeleteBookmarkFolder)
  deleteBookmarkFolder({ getState, setState }: StateContext<BookmarkFolderStateModel>, { id }: DeleteBookmarkFolder) {
    return this.bookmarkService.deleteFolder(id).pipe(
      tap(() => {
        const state = getState();
        const filteredArray = state.bookmarkFolders.filter((item) => item.id !== id);
        setState({
          ...state,
          bookmarkFolders: filteredArray,
        });
      }),
    );
  }

  @Action(SetActiveBookmarkFolder, { cancelUncompleted: true })
  setSelectedBookmarkFolder(
    { getState, setState }: StateContext<BookmarkFolderStateModel>,
    { payload }: SetActiveBookmarkFolder,
  ) {
    const state = getState();
    setState({
      ...state,
      activeBookmarkFolder: payload,
    });
  }
}
