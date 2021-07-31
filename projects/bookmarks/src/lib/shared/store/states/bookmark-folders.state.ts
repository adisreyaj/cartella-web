import { Injectable } from '@angular/core';
import { BaseStorageService } from '@cartella/services/storage/base-storage.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
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
  activeBookmarkFolder: BookmarkFolder | undefined = undefined;
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
  getBookmarkFolders({ getState, patchState }: StateContext<BookmarkFolderStateModel>) {
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
          patchState({
            bookmarkFolders: result,
            fetched: true,
            activeBookmarkFolder: ALL_BOOKMARKS_FOLDER,
          });
        }),
      );
    }
  }

  @Action(AddBookmarkFolder)
  addBookmarkFolder({ setState }: StateContext<BookmarkFolderStateModel>, { payload }: AddBookmarkFolder) {
    return this.bookmarkService.createNewFolder(payload).pipe(
      tap((result) => {
        setState(
          patch({
            bookmarkFolders: append([result]),
            activeBookmarkFolder: result,
          }),
        );
      }),
    );
  }

  @Action(UpdateBookmarkFolder)
  updateBookmarkFolder({ setState }: StateContext<BookmarkFolderStateModel>, { payload, id }: UpdateBookmarkFolder) {
    return this.bookmarkService.updateFolder(id, payload).pipe(
      tap((result) => {
        setState(
          patch({
            bookmarkFolders: updateItem((item) => item?.id === id, result),
          }),
        );
      }),
    );
  }

  @Action(DeleteBookmarkFolder)
  deleteBookmarkFolder({ setState }: StateContext<BookmarkFolderStateModel>, { id }: DeleteBookmarkFolder) {
    return this.bookmarkService.deleteFolder(id).pipe(
      tap(() => {
        setState(
          patch({
            bookmarkFolders: removeItem<BookmarkFolder>((item) => item?.id === id),
          }),
        );
      }),
    );
  }

  @Action(SetActiveBookmarkFolder, { cancelUncompleted: true })
  setSelectedBookmarkFolder(
    { patchState }: StateContext<BookmarkFolderStateModel>,
    { payload }: SetActiveBookmarkFolder,
  ) {
    patchState({
      activeBookmarkFolder: payload,
    });
  }
}
