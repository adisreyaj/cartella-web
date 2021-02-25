import { Injectable } from '@angular/core';
import { DedicatedInstanceFactory, NgForage } from 'ngforage';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { StorageFolders } from './storage.interface';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  instances = new Map<string, NgForage>();
  constructor(dif: DedicatedInstanceFactory) {
    Object.values(StorageFolders).forEach((key) => {
      this.instances.set(
        key,
        dif.createNgForage({ name: 'cartella', storeName: key })
      );
    });
  }

  setItem<DataType = any>(type: StorageFolders, key: string, value: DataType) {
    return from(this.instances.get(type).setItem(key, value)).pipe(
      catchError(() => of(null))
    );
  }
  getItem<DataType = any>(type: StorageFolders, key: string) {
    return from(this.instances.get(type).getItem<DataType>(key)).pipe(
      catchError(() => of(null))
    );
  }

  /**
   * Get all items from user saved folders. Since `starred` items are
   * stored as a folder, when fetching all the items, there will be duplicated
   * entry as same item can be in user folder as well as starred folder.
   */
  getAllItemsFromUserFolder<DataType = any>(type: StorageFolders) {
    const items = from(this.instances.get(type).keys()).pipe(
      catchError(() => of(null))
    );
    return items.pipe(
      // Starred items should be removed as its duplicated already
      map((keys) => keys.filter((key) => key !== 'starred')),
      map((keys: string[]) =>
        keys.reduce(
          (acc, curr) => [
            ...acc,
            this.instances.get(type).getItem<DataType[]>(curr),
          ],
          []
        )
      ),
      map((promises: Promise<DataType[]>[]) => Promise.all(promises)),
      switchMap((promise: Promise<DataType[][]>) =>
        from(promise).pipe(catchError(() => of(null)))
      ),
      map((values) =>
        values.reduce((acc, curr: DataType[]) => [...acc, ...curr], [])
      )
    );
  }
  deleteItem(type: StorageFolders, key: string) {
    return from(this.instances.get(type).removeItem(key)).pipe(
      catchError(() => of(null))
    );
  }
}
