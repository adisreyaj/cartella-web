import { Injectable } from '@angular/core';
import { DedicatedInstanceFactory, NgForage } from 'ngforage';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
    return from(this.instances.get(type).setItem(key, value));
  }
  getItem<DataType = any>(type: StorageFolders, key: string) {
    return from(this.instances.get(type).getItem<DataType>(key));
  }

  getAllItemsFromUserFolder<DataType = any>(type: StorageFolders) {
    const items = from(this.instances.get(type).keys());
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
      switchMap((promise: Promise<DataType[][]>) => from(promise)),
      map((values) =>
        values.reduce((acc, curr: DataType[]) => [...acc, ...curr], [])
      )
    );
  }
  deleteItem(type: StorageFolders, key: string) {
    return from(this.instances.get(type).removeItem(key));
  }
}
