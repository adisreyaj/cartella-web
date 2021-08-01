import { Injectable } from '@angular/core';
import { BaseStorageService } from '@cartella/services/storage/base-storage.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Bookmark } from '../../interfaces/bookmarks.interface';
import { BookmarksService } from '../../services/bookmarks.service';
import {
  AddBookmark,
  DeleteBookmark,
  GetBookmarks,
  SetActiveBookmark,
  UpdateBookmark,
} from '../actions/bookmarks.action';

export class BookmarkStateModel {
  allBookmarks: Bookmark[] = [];
  fetched = false;
  bookmarksShown: Bookmark[] = [];
  activeBookmark: Bookmark | undefined = undefined;
}
@State({
  name: 'bookmarks',
  defaults: {
    allBookmarks: [],
    fetched: false,
    bookmarksShown: [],
    activeBookmark: null,
  },
})
@Injectable()
export class BookmarkState {
  constructor(private bookmarkService: BookmarksService, private storage: BaseStorageService<Bookmark>) {}

  @Selector()
  static getAllBookmarks(state: BookmarkStateModel) {
    return state.allBookmarks;
  }

  @Selector()
  static getBookmarkFetched(state: BookmarkStateModel) {
    return state.fetched;
  }

  @Selector()
  static getBookmarksShown(state: BookmarkStateModel) {
    return state.bookmarksShown;
  }

  @Selector()
  static getActiveBookmark(state: BookmarkStateModel) {
    return state.activeBookmark;
  }

  @Action(GetBookmarks, { cancelUncompleted: true })
  getBookmarks({ getState, patchState }: StateContext<BookmarkStateModel>, { id }: GetBookmarks) {
    switch (id) {
      case 'all':
        const state = getState();
        if (state.fetched) {
          return this.storage.getAllItemsFromUserFolder().pipe(
            switchMap((bookmarks) => {
              if (!bookmarks) {
                return this.bookmarkService.getBookmarks().pipe(
                  map(({ payload }) => payload),
                  tap((result) => {
                    patchState({
                      bookmarksShown: result,
                    });
                  }),
                );
              } else {
                patchState({
                  bookmarksShown: bookmarks,
                });
                return of(bookmarks);
              }
            }),
          );
        } else {
          return this.bookmarkService.getBookmarks().pipe(
            map(({ payload }) => payload),
            tap((result) => {
              patchState({
                fetched: true,
                allBookmarks: result,
                bookmarksShown: result,
              });
            }),
          );
        }
      case 'starred':
        return this.storage.getItem(id).pipe(
          switchMap((bookmarks) => {
            if (!bookmarks) {
              return this.bookmarkService.getFavoriteBookmarks().pipe(
                map(({ payload }) => payload),
                tap((result) => {
                  patchState({
                    bookmarksShown: result,
                  });
                }),
              );
            } else {
              patchState({
                bookmarksShown: bookmarks,
              });
              return of(bookmarks);
            }
          }),
        );
      default: {
        return this.storage.getItem(id).pipe(
          switchMap((bookmarks) => {
            if (!bookmarks) {
              return this.bookmarkService.getBookmarksInFolder(id).pipe(
                map(({ payload }) => payload),
                tap((result) => {
                  patchState({
                    bookmarksShown: result,
                  });
                }),
              );
            } else {
              patchState({
                bookmarksShown: bookmarks,
              });
              return of(bookmarks);
            }
          }),
        );
      }
    }
  }

  @Action(AddBookmark)
  addBookmark({ setState }: StateContext<BookmarkStateModel>, { payload }: AddBookmark) {
    return this.bookmarkService.createNewBookmark(payload).pipe(
      tap((result) => {
        setState(
          patch({
            allBookmarks: append([result]),
            bookmarksShown: append([result]),
            activeBookmark: result,
          }),
        );
      }),
    );
  }

  @Action(UpdateBookmark)
  updateBookmark({ setState }: StateContext<BookmarkStateModel>, { payload, id }: UpdateBookmark) {
    return this.bookmarkService.updateBookmark(id, payload).pipe(
      tap((result) => {
        setState(
          patch({
            allBookmarks: updateItem((item) => item?.id === id, result),
            bookmarksShown: updateItem((item) => item?.id === id, result),
          }),
        );
      }),
    );
  }

  @Action(DeleteBookmark)
  deleteBookmark({ setState }: StateContext<BookmarkStateModel>, { id }: DeleteBookmark) {
    return this.bookmarkService.deleteBookmark(id).pipe(
      tap(() => {
        setState(
          patch({
            allBookmarks: removeItem<Bookmark>((item) => item?.id === id),
            bookmarksShown: removeItem<Bookmark>((item) => item?.id === id),
          }),
        );
      }),
    );
  }

  @Action(SetActiveBookmark, { cancelUncompleted: true })
  setSelectedBookmarkId({ patchState }: StateContext<BookmarkStateModel>, { payload }: SetActiveBookmark) {
    patchState({
      activeBookmark: payload,
    });
  }
}
