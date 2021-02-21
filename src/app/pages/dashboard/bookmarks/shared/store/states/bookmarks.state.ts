import { Injectable } from '@angular/core';
import { StorageFolders } from '@app/services/storage/storage.interface';
import { StorageService } from '@app/services/storage/storage.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
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
  allBookmarks: Bookmark[];
  fetched: boolean;
  bookmarksShown: Bookmark[];
  activeBookmark: Bookmark;
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
  constructor(
    private bookmarkService: BookmarksService,
    private storage: StorageService
  ) {}

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
  getBookmarks(
    { getState, setState, patchState }: StateContext<BookmarkStateModel>,
    { id }: GetBookmarks
  ) {
    switch (id) {
      case 'all':
        const state = getState();
        if (state.fetched) {
          return this.storage
            .getAllItems<Bookmark>(StorageFolders.bookmarks)
            .pipe(
              switchMap((bookmarks) => {
                if (!bookmarks) {
                  return this.bookmarkService.getBookmarks().pipe(
                    map(({ payload }) => payload),
                    tap((result) => {
                      patchState({
                        bookmarksShown: result,
                      });
                    })
                  );
                } else {
                  patchState({
                    bookmarksShown: bookmarks,
                  });
                  return of(bookmarks);
                }
              })
            );
        } else {
          return this.bookmarkService.getBookmarks().pipe(
            map(({ payload }) => payload),
            tap((result) => {
              setState({
                ...state,
                fetched: true,
                allBookmarks: result,
                bookmarksShown: result,
              });
            })
          );
        }
      case 'starred':
        return this.storage.getItem(StorageFolders.bookmarks, id).pipe(
          switchMap((bookmarks) => {
            if (!bookmarks) {
              return this.bookmarkService.getFavoriteBookmarks().pipe(
                map(({ payload }) => payload),
                tap((result) => {
                  patchState({
                    bookmarksShown: result,
                  });
                })
              );
            } else {
              patchState({
                bookmarksShown: bookmarks,
              });
              return of(bookmarks);
            }
          })
        );
      default: {
        return this.storage.getItem(StorageFolders.bookmarks, id).pipe(
          switchMap((bookmarks) => {
            if (!bookmarks) {
              return this.bookmarkService.getBookmarksInFolder(id).pipe(
                map(({ payload }) => payload),
                tap((result) => {
                  patchState({
                    bookmarksShown: result,
                  });
                })
              );
            } else {
              patchState({
                bookmarksShown: bookmarks,
              });
              return of(bookmarks);
            }
          })
        );
      }
    }
  }

  @Action(AddBookmark)
  addBookmark(
    { getState, patchState }: StateContext<BookmarkStateModel>,
    { payload }: AddBookmark
  ) {
    return this.bookmarkService.createNewBookmark(payload).pipe(
      tap((result) => {
        const state = getState();
        patchState({
          allBookmarks: [...state.allBookmarks, result],
          bookmarksShown: [...state.bookmarksShown, result],
          activeBookmark: result,
        });
      })
    );
  }

  @Action(UpdateBookmark)
  updateBookmark(
    { getState, patchState }: StateContext<BookmarkStateModel>,
    { payload, id }: UpdateBookmark
  ) {
    return this.bookmarkService.updateBookmark(id, payload).pipe(
      tap((result) => {
        const state = getState();
        const allBookmarkList = [...state.allBookmarks];
        const bookmarkIndex = allBookmarkList.findIndex(
          (item) => item.id === id
        );
        allBookmarkList[bookmarkIndex] = result;
        const shownBookmarkList = [...state.bookmarksShown];
        const shownBookmarkIndex = shownBookmarkList.findIndex(
          (item) => item.id === id
        );
        shownBookmarkList[shownBookmarkIndex] = result;
        patchState({
          allBookmarks: allBookmarkList,
          bookmarksShown: shownBookmarkList,
        });
      })
    );
  }

  @Action(DeleteBookmark)
  deleteBookmark(
    { getState, patchState }: StateContext<BookmarkStateModel>,
    { id }: DeleteBookmark
  ) {
    return this.bookmarkService.deleteBookmark(id).pipe(
      tap(() => {
        const state = getState();
        const filteredAllBookmarks = state.allBookmarks.filter(
          (item) => item.id !== id
        );
        const filteredVisibleBookmarks = state.bookmarksShown.filter(
          (item) => item.id !== id
        );
        patchState({
          allBookmarks: filteredAllBookmarks,
          bookmarksShown: filteredVisibleBookmarks,
        });
      })
    );
  }

  @Action(SetActiveBookmark, { cancelUncompleted: true })
  setSelectedBookmarkId(
    { patchState }: StateContext<BookmarkStateModel>,
    { payload }: SetActiveBookmark
  ) {
    patchState({
      activeBookmark: payload,
    });
  }
}
