import { Pipe, PipeTransform } from '@angular/core';
import { Bookmark } from '@cartella/bookmarks';
import { Package } from '@cartella/packages';
import { Snippet } from '@cartella/snippets';
import { UserState } from '@cartella/store/states/user.state';
import { Store } from '@ngxs/store';

@Pipe({
  name: 'isOwner',
})
export class IsOwnerPipe implements PipeTransform {
  constructor(private store: Store) {}
  /**
   * Checks whether the user is the owner of the item
   *
   * @param entity - the item to check
   */
  transform(entity: Bookmark | Snippet | Package): boolean {
    const currentUser = this.store.selectSnapshot(UserState.getLoggedInUser);
    if (entity?.owner?.id === currentUser?.id) {
      return true;
    }
    return false;
  }
}
