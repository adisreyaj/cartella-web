import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
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
  bookmarksShown: Bookmark[];
  activeBookmark: Bookmark;
}
@State({
  name: 'bookmarks',
})
@Injectable()
export class BookmarkState {
  constructor(private bookmarkService: BookmarksService) {}

  @Selector()
  static getAllBookmarks(state: BookmarkStateModel) {
    return state.allBookmarks;
  }
  @Selector()
  static getBookmarksShown(state: BookmarkStateModel) {
    return state.bookmarksShown;
  }

  @Selector()
  static getActiveBookmark(state: BookmarkStateModel) {
    return state.activeBookmark;
  }

  @Action(GetBookmarks)
  getBookmarks(
    { getState, setState }: StateContext<BookmarkStateModel>,
    { id }: GetBookmarks
  ) {
    switch (id) {
      case 'all':
        return this.bookmarkService.getBookmarks().pipe(
          map(({ payload }) => payload),
          tap((result) => {
            const state = getState();
            setState({
              ...state,
              allBookmarks: result,
              bookmarksShown: result,
            });
          })
        );
      case 'starred':
        return this.bookmarkService.getFavoriteBookmarks().pipe(
          map(({ payload }) => payload),
          tap((result) => {
            const state = getState();
            setState({
              ...state,
              bookmarksShown: result,
            });
          })
        );
      default:
        return this.bookmarkService.getBookmarksInFolder(id).pipe(
          map(({ payload }) => payload),
          tap((result) => {
            const state = getState();
            setState({
              ...state,
              bookmarksShown: result,
            });
          })
        );
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
        });
      })
    );
  }

  @Action(UpdateBookmark)
  updateBookmark(
    { getState, setState }: StateContext<BookmarkStateModel>,
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
        const shownBookmarkList = [...state.allBookmarks];
        const shownBookmarkIndex = shownBookmarkList.findIndex(
          (item) => item.id === id
        );
        shownBookmarkList[shownBookmarkIndex] = result;
        setState({
          ...state,
          allBookmarks: allBookmarkList,
          bookmarksShown: shownBookmarkList,
        });
      })
    );
  }

  @Action(DeleteBookmark)
  deleteBookmark(
    { getState, setState }: StateContext<BookmarkStateModel>,
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
        setState({
          ...state,
          allBookmarks: filteredAllBookmarks,
          bookmarksShown: filteredVisibleBookmarks,
        });
      })
    );
  }

  @Action(SetActiveBookmark)
  setSelectedBookmarkId(
    { getState, setState }: StateContext<BookmarkStateModel>,
    { payload }: SetActiveBookmark
  ) {
    const state = getState();
    setState({
      ...state,
      activeBookmark: payload,
    });
  }
}
