import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Bookmark } from '../../../pages/dashboard/bookmarks/shared/interfaces/bookmarks.interface';
import { Package } from '../../../pages/dashboard/packages/shared/interfaces/packages.interface';
import { Snippet } from '../../../pages/dashboard/snippets/shared/interfaces/snippets.interface';
import { User } from '../../interfaces/user.interface';
import { UserState } from '../../store/states/user.state';

@Injectable({
  providedIn: 'root',
})
export class FolderAssortService {
  constructor(private store: Store) {}

  assort(items: Bookmark[] | Snippet[] | Package[]) {
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
