import { Injectable } from '@angular/core';
import { StorageFolders } from '@app/services/storage/storage.interface';
import { StorageService } from '@app/services/storage/storage.service';
import { combineLatest, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Bookmark, BookmarkFolder } from '../interfaces/bookmarks.interface';

@Injectable({
  providedIn: 'root',
})
export class BookmarkHelperService {
  constructor(private storage: StorageService) {}

  updateBookmarksInIDB(
    bookmarks: Bookmark[],
    bookmarkFolders: BookmarkFolder[]
  ) {
    if (bookmarks != null && bookmarkFolders != null) {
      return combineLatest([
        this.saveStarredBookmarks(bookmarks),
        this.saveBookmarksInIDB(
          this.groupBookmarksInFolders(bookmarkFolders, bookmarks)
        ),
      ]).pipe(catchError(() => throwError(new Error(''))));
    }
    return throwError(new Error(''));
  }

  updateBookmarkFoldersInDb(bookmarkFolders: BookmarkFolder[]) {
    if (bookmarkFolders != null) {
      return this.saveBookmarkFoldersInIDB(bookmarkFolders);
    }
  }

  private saveBookmarksInIDB = (foldersWithBookmarks: {
    [key: string]: Bookmark[];
  }) =>
    Object.keys(foldersWithBookmarks).map((key) =>
      this.storage.setItem(
        StorageFolders.bookmarks,
        key,
        foldersWithBookmarks[key]
      )
    );

  private saveBookmarkFoldersInIDB = (folders: BookmarkFolder[]) =>
    this.storage.setItem(StorageFolders.folders, 'bookmarks', folders);

  private saveStarredBookmarks = (bookmarks: Bookmark[]) =>
    this.storage.setItem(
      StorageFolders.bookmarks,
      'starred',
      bookmarks.filter(({ favorite }) => favorite)
    );

  private groupBookmarksInFolders = (
    folders: BookmarkFolder[],
    bookmarks: Bookmark[]
  ) => {
    if (folders != null) {
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
}
