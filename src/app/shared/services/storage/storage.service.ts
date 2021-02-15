import { Injectable } from '@angular/core';
import { DedicatedInstanceFactory, NgForage } from 'ngforage';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export enum STORAGE_INSTANCE {
  COUNT = 'COUNT',
  FOLDERS = 'FOLDERS',
  SNIPPETS = 'SNIPPETS',
  BOOKMARKS = 'BOOKMARKS',
  PACKAGES = 'PACKAGES',
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  instances = new Map<string, NgForage>();
  constructor(private readonly ngf: NgForage, dif: DedicatedInstanceFactory) {
    Object.keys(STORAGE_INSTANCE).forEach((key) => {
      this.instances.set(
        key,
        dif.createNgForage({ name: 'cartella', storeName: key })
      );
    });
  }

  setItem<DataType = any>(
    type: STORAGE_INSTANCE,
    key: string,
    value: DataType
  ) {
    return from(this.instances.get(type).setItem(key, value));
  }
  getItem<DataType = any>(type: STORAGE_INSTANCE, key: string) {
    return from(this.instances.get(type).getItem<DataType>(key));
  }

  getAllItems<DataType = any>(type: STORAGE_INSTANCE) {
    const items = from(this.instances.get(type).keys());
    return items.pipe(
      map((keys: string[]) => {
        return keys.reduce((acc, curr) => {
          return [...acc, this.instances.get(type).getItem<DataType[]>(curr)];
        }, []);
      }),
      map((promises: Promise<DataType[]>[]) => Promise.all(promises)),
      switchMap((promise: Promise<DataType[][]>) => from(promise)),
      map((items) =>
        items.reduce((acc, curr: DataType[]) => [...acc, ...curr], [])
      )
    );
  }
  deleteItem(type: STORAGE_INSTANCE, key: string) {
    return from(this.instances.get(type).removeItem(key));
  }
}
