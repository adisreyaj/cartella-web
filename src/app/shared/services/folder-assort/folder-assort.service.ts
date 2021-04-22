import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  Bookmark,
  BookmarkFolder,
} from '../../../pages/dashboard/bookmarks/shared/interfaces/bookmarks.interface';
import {
  Package,
  PackageFolder,
} from '../../../pages/dashboard/packages/shared/interfaces/packages.interface';
import {
  Snippet,
  SnippetFolder,
} from '../../../pages/dashboard/snippets/shared/interfaces/snippets.interface';
import { User } from '../../interfaces/user.interface';
import { UserState } from '../../store/states/user.state';
type Items = Bookmark | Snippet | Package;
type Folders = BookmarkFolder | SnippetFolder | PackageFolder;
type Entities = 'bookmarks' | 'snippets' | 'packages';
@Injectable({
  providedIn: 'root',
})
export class FolderAssortService {
  constructor(private store: Store) {}

  assort(items: Items[]) {
    const user = this.store.selectSnapshot<User>(UserState.getLoggedInUser);
    let shared = [];
    let own = [];
    let starred = [];
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
