import { Pipe, PipeTransform } from '@angular/core';
import { EntityOwnerResponse } from '@cartella/interfaces/entity.interface';
import { UserState } from '@cartella/store/states/user.state';
import { Store } from '@ngxs/store';

@Pipe({
  name: 'isSharedItem',
})
export class IsSharedItemPipe implements PipeTransform {
  constructor(private store: Store) {}
  transform(owner: EntityOwnerResponse): boolean {
    const currentUser = this.store.selectSnapshot(UserState.getLoggedInUser);
    if (owner != null && currentUser != null) {
      if (owner.id !== currentUser.id) {
        return true;
      }
      return false;
    }
    return false;
  }
}
