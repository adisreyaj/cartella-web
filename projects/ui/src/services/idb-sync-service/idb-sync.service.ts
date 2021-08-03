import { Injectable } from '@angular/core';
import { Bookmark, BookmarkFolder } from '@cartella/bookmarks';
import { Package, PackageFolder } from '@cartella/packages';
import { Snippet, SnippetFolder } from '@cartella/snippets';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, mapTo, take } from 'rxjs/operators';
import { FolderAssortService } from '../folder-assort/folder-assort.service';
import { BaseStorageService } from '../storage/base-storage.service';

type Items = Bookmark | Snippet | Package;
type Folders = BookmarkFolder | SnippetFolder | PackageFolder;

@Injectable()
export class IDBSyncService {
  constructor(private folderAssort: FolderAssortService, private storage: BaseStorageService) {}

  syncItems(items: Items[], folders: Folders[]): Observable<boolean> {
    if (items != null && folders != null) {
      const { own, shared, starred } = this.folderAssort.assort(items);
      const itemsGroupedByFolders = this.groupItemsInFolders(folders, own);
      return forkJoin([
        this.syncStarredItems(starred),
        this.syncSharedItems(shared),
        this.syncOwnItems(itemsGroupedByFolders),
      ]).pipe(
        take(1),
        mapTo(true),
        catchError((err) => {
          console.error(err);
          return of(false);
        }),
      );
    }
    return of(false);
  }

  syncFolders(folders: Folders[]) {
    return this.storage.setItem('folders', folders).pipe(
      mapTo(true),
      catchError((err) => {
        console.error('Save Bookmark Folders', err);
        return of(false);
      }),
    );
  }

  private syncOwnItems(itemsGroupedIntoFolders: { [key: string]: Items[] }) {
    const folders = Object.keys(itemsGroupedIntoFolders);
    if (folders?.length > 0) {
      const setOps$ = folders.map((key) => this.storage.setItem(key, itemsGroupedIntoFolders[key]));
      return forkJoin(setOps$).pipe(
        mapTo(true),
        catchError((err) => {
          console.error('Save Bookmark Folders', err);
          return of(false);
        }),
      );
    }
    return of(false);
  }

  private syncSharedItems(items: Items[]) {
    return this.storage.setItem('shared', items).pipe(
      mapTo(true),
      catchError((err) => {
        console.error('Save Starred Bookmarks', err);
        return of(false);
      }),
    );
  }
  private syncStarredItems(items: Items[]) {
    return this.storage.setItem('starred', items).pipe(
      mapTo(true),
      catchError((err) => {
        console.error('Save Starred Bookmarks', err);
        return of(false);
      }),
    );
  }

  /**
   * Group Items based on the folder
   *
   * ```json
   * 'id': [{
   *    '1234656267': []
   *  },{
   * '  83736372': []
   * }]
   * ```
   */
  private groupItemsInFolders = (folders: Folders[], items: Items[]) => {
    if (folders != null && folders?.length > 0) {
      return folders.reduce(
        (acc, { id }) => ({
          ...acc,
          [id]: items?.length > 0 ? items.filter(({ folder: { id: folderId } }) => folderId === id) : [],
        }),
        {},
      );
    }
    return [];
  };
}
