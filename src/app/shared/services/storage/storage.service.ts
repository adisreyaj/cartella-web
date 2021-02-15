import { Injectable } from '@angular/core';
import { DedicatedInstanceFactory, NgForage } from 'ngforage';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export enum StorageInstanceTypes {
  count = 'COUNT',
  folders = 'FOLDERS',
  snippets = 'SNIPPETS',
  bookmarks = 'BOOKMARKS',
  packages = 'PACKAGES',
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  instances = new Map<string, NgForage>();
  constructor(private readonly ngf: NgForage, dif: DedicatedInstanceFactory) {
    Object.keys(StorageInstanceTypes).forEach((key) => {
      this.instances.set(
        key,
        dif.createNgForage({ name: 'cartella', storeName: key })
      );
    });
  }

  setItem<DataType = any>(
    type: StorageInstanceTypes,
    key: string,
    value: DataType
  ) {
    return from(this.instances.get(type).setItem(key, value));
  }
  getItem<DataType = any>(type: StorageInstanceTypes, key: string) {
    return from(this.instances.get(type).getItem<DataType>(key));
  }

  getAllItems<DataType = any>(type: StorageInstanceTypes) {
    const items = from(this.instances.get(type).keys());
    return items.pipe(
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
      map((items) =>
        items.reduce((acc, curr: DataType[]) => [...acc, ...curr], [])
      )
    );
  }
  deleteItem(type: StorageInstanceTypes, key: string) {
    return from(this.instances.get(type).removeItem(key));
  }
}
