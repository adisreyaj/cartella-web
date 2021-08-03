import { Injectable } from '@angular/core';
import { Bookmark, BookmarkFolder } from '@cartella/bookmarks';
import { User } from '@cartella/interfaces/user.interface';
import { Package, PackageFolder } from '@cartella/packages';
import { Snippet, SnippetFolder } from '@cartella/snippets';
import { UserState } from '@cartella/store/states/user.state';
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
    const user = this.store.selectSnapshot<User>(UserState.getLoggedInUser as any);
    let shared: Items[] = [];
    let own: Items[] = [];
    let starred: Items[] = [];
    if (items?.length > 0) {
      items.forEach((item) => {
        if (item.owner.id === user.id) {
          if (item.favorite) {
            starred = [...starred, item];
          } else {
            own = [...own, item];
          }
        } else {
          shared = [...shared, item];
        }
      });
    }
    return { own, shared, starred };
  }
}
