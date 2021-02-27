import { Injectable } from '@angular/core';
import { StorageFolders } from '@app/services/storage/storage.interface';
import { StorageService } from '@app/services/storage/storage.service';
import { combineLatest, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Snippet, SnippetFolder } from '../../interfaces/snippets.interface';

@Injectable({
  providedIn: 'root',
})
export class SnippetHelperService {
  constructor(private storage: StorageService) {}

  /**
   * Update the snippets in the Indexed DB
   *
   * @param snippets - all snippets
   * @param snippetFolders - all snippet folders
   */
  updateSnippetsInIDB(snippets: Snippet[], snippetFolders: SnippetFolder[]) {
    if (snippets != null && snippetFolders != null) {
      return combineLatest([
        this.saveStarredSnippets(snippets),
        this.saveSnippetsInIDB(
          this.groupSnippetsInFolders(snippetFolders, snippets)
        ),
      ]).pipe(catchError(() => throwError(new Error(''))));
    }
    return throwError(new Error(''));
  }

  updateSnippetFoldersInDb(snippetFolders: SnippetFolder[]) {
    if (snippetFolders != null) {
      return this.saveSnippetFoldersInIDB(snippetFolders);
    }
  }

  private saveSnippetsInIDB = (foldersWithSnippets: {
    [key: string]: Snippet[];
  }) =>
    Object.keys(foldersWithSnippets).map((key) =>
      this.storage.setItem(
        StorageFolders.snippets,
        key,
        foldersWithSnippets[key]
      )
    );

  private saveSnippetFoldersInIDB = (folders: SnippetFolder[]) =>
    this.storage.setItem(StorageFolders.folders, 'snippets', folders);

  private saveStarredSnippets = (snippets: Snippet[]) =>
    this.storage.setItem(
      StorageFolders.snippets,
      'starred',
      snippets.filter(({ favorite }) => favorite)
    );

  /**
   * Group snippets based on the folder
   *
   * ```json
   * 'id': [{},{}]
   * ```
   */
  private groupSnippetsInFolders = (
    folders: SnippetFolder[],
    snippets: Snippet[]
  ) => {
    if (folders != null) {
      return folders.reduce(
        (acc, { id }) => ({
          ...acc,
          [id]: snippets.filter(
            ({ folder: { id: folderId } }) => folderId === id
          ),
        }),
        {}
      );
    }
    return [];
  };
}
