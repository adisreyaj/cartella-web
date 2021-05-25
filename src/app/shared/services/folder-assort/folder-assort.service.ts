import { Injectable } from '@angular/core';
import { Bookmark, BookmarkFolder } from '@cartella/bookmarks';
import { User } from '@cartella/interfaces/user.interface';
import { Package, PackageFolder } from '@cartella/packages';
import { Snippet, SnippetFolder } from '@cartella/snippets';
import { Store } from '@ngxs/store';
type Items = Bookmark | Snippet | Package;
type Folders = BookmarkFolder | SnippetFolder | PackageFolder;
type Entities = 'bookmarks' | 'snippets' | 'packages';
@Injectable({
  providedIn: 'root',
})
export class FolderAssortService {
  constructor(private store: Store) {}

  assort(items: Items[]) {
    const user = this.store.selectSnapshot<User>((state) => state.user);
    let shared: Items[] = [];
    let own: Items[] = [];
    let starred: Items[] = [];
    if (items?.length > 0) {
      items.forEach((bookmark) => {
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
  }
}
