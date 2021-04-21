import { Injectable } from '@angular/core';
import { StorageFolders } from '@app/services/storage/storage.interface';
import { StorageService } from '@app/services/storage/storage.service';
import { Store } from '@ngxs/store';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../../../../shared/interfaces/user.interface';
import { UserState } from '../../../../../shared/store/states/user.state';
import { Bookmark, BookmarkFolder } from '../interfaces/bookmarks.interface';

@Injectable({
  providedIn: 'root',
})
export class BookmarkHelperService {
  constructor(private storage: StorageService, private store: Store) {}

  /**
   * Update the bookmarks in the Indexed DB
   *
   * @param bookmarks - all bookmarks
   * @param bookmarkFolders - all bookmark folders
   */
  updateBookmarksInIDB(
    bookmarks: Bookmark[],
    bookmarkFolders: BookmarkFolder[]
  ) {
    if (bookmarks != null && bookmarkFolders != null) {
      const { own, shared, starred } = this.assortBookmarks(bookmarks);
      const bookmarksGroupedByFolders = this.groupBookmarksInFolders(
        bookmarkFolders,
        own
      );
      return forkJoin([
        this.saveStarredBookmarks(starred),
        this.saveSharedBookmarks(shared),
        this.saveBookmarksInIDB(bookmarksGroupedByFolders),
      ]).pipe(
        catchError((err) => {
          console.error(err);
          return of(null);
        })
      );
    }
    return of(null);
  }

  updateBookmarkFoldersInDb(bookmarkFolders: BookmarkFolder[]) {
    if (bookmarkFolders != null) {
      return this.saveBookmarkFoldersInIDB(bookmarkFolders);
    }
    return of(null);
  }

  private saveBookmarksInIDB = (foldersWithBookmarks: {
    [key: string]: Bookmark[];
  }) => {
    const folders = Object.keys(foldersWithBookmarks);
    if (folders?.length > 0) {
      return folders.map((key) =>
        this.storage.setItem(
          StorageFolders.bookmarks,
          key,
          foldersWithBookmarks[key]
        )
      );
    }
    return of(null);
  };

  private saveBookmarkFoldersInIDB = (folders: BookmarkFolder[]) =>
    this.storage.setItem(StorageFolders.folders, 'bookmarks', folders).pipe(
      catchError((err) => {
        console.error('Save Bookmark Folders', err);
        return of(null);
      })
    );

  private saveStarredBookmarks = (bookmarks: Bookmark[]) =>
    this.storage.setItem(StorageFolders.bookmarks, 'starred', bookmarks).pipe(
      catchError((err) => {
        console.error('Save Starred Bookmarks', err);
        return of(null);
      })
    );

  private saveSharedBookmarks = (bookmarks: Bookmark[]) =>
    this.storage.setItem(StorageFolders.bookmarks, 'shared', bookmarks).pipe(
      catchError((err) => {
        console.error('Save Shared Bookmarks', err);
        return of(null);
      })
    );

  /**
   * Group bookmarks based on the folder
   *
   * ```json
   * 'id': [{},{}]
   * ```
   */
  private groupBookmarksInFolders = (
    folders: BookmarkFolder[],
    bookmarks: Bookmark[]
  ) => {
    if (folders != null && folders?.length > 0) {
      return folders.reduce(
        (acc, { id }) => ({
          ...acc,
          [id]: bookmarks.filter(
            ({ folder: { id: folderId } }) => folderId === id
          ),
        }),
        {}
      );
    }
    return [];
  };

  private assortBookmarks = (bookmarks: Bookmark[]) => {
    const user = this.store.selectSnapshot<User>(UserState.getLoggedInUser);
    let shared = [];
    let own = [];
    let starred = [];
    if (bookmarks?.length > 0) {
      bookmarks.forEach((bookmark) => {
        if (bookmark.owner.id === user.id) {
          if (bookmark.favorite) {
            starred = [...starred, bookmark];
          } else {
            own = [...own, bookmark];
          }
        } else {
          shared = [...shared, bookmark];
        }
      });
    }
    return { own, shared, starred };
  };
}
