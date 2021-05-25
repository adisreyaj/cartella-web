import { Pipe, PipeTransform } from '@angular/core';
import { Bookmark } from '@cartella/bookmarks';
import { Access } from '@cartella/interfaces/share.interface';
import { Package } from '@cartella/packages';
import { Snippet } from '@cartella/snippets';
import { UserState } from '@cartella/store/states/user.state';
import { Store } from '@ngxs/store';

@Pipe({
  name: 'hasWriteAccess',
})
export class HasWriteAccessPipe implements PipeTransform {
  constructor(private store: Store) {}
  /**
   * Checks whether the current user has `WRITE` access to the item
   *
   * @param owner - owner of the item
   */
  transform(entity: Bookmark | Snippet | Package | null): boolean {
    const currentUser = this.store.selectSnapshot(UserState.getLoggedInUser);
    if (entity != null && entity.owner != null && currentUser != null) {
      if (entity.owner.id === currentUser.id) {
        return true;
      }
      return entity.share.find(({ email }) => email === currentUser.email)?.access === Access.write;
    }
    return false;
  }
}
