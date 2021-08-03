import { Injectable } from '@angular/core';
import { NgForage } from 'ngforage';
import { from, Observable, of } from 'rxjs';
import { catchError, filter, map, mapTo, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BaseStorageService<DataType = any> {
  instance: NgForage;
  constructor(instance: NgForage) {
    this.instance = instance;
  }
  setItem(key: string, value: DataType) {
    return from(this.instance.setItem(key, value)).pipe(catchError(() => of(null)));
  }
  getItem(key: string) {
    return from(this.instance.getItem<DataType[]>(key)).pipe(catchError(() => of(null)));
  }

  deleteItem(key: string) {
    return from(this.instance.removeItem(key)).pipe(
      mapTo(true),
      catchError(() => of(false)),
    );
  }

  flush() {
    return from(this.instance.clear()).pipe(
      mapTo(true),
      catchError(() => of(false)),
    );
  }

  /**
   * Get all items from user saved folders. Since `starred` items are
   * stored as a folder, when fetching all the items, there will be duplicated
   * entry as same item can be in user folder as well as starred folder.
   */
  getAllItemsFromUserFolder() {
    const items: Observable<string[]> = from(this.instance.keys()).pipe(catchError(() => of([])));
    return items.pipe(
      // Starred items should be removed as its duplicated already
      map((keys) => keys.filter((key) => !['starred', 'folders'].includes(key))),
      filter((keys) => keys.length > 0),
      map((keys) => keys.map((key) => this.instance.getItem<DataType[]>(key))),
      filter((promises) => promises?.length > 0),
      map((promises) => Promise.all(promises)),
      filter((promise) => promise != null),
      switchMap((promise: Promise<DataType[][]>) => from(promise).pipe(catchError(() => of([])))),
      map((values: DataType[][]) =>
        values.reduce((acc, curr: DataType[]) => {
          if (curr && Array.isArray(curr) && curr.length > 0) {
            return [...acc, ...curr];
          }
          return acc;
        }, []),
      ),
    );
  }

  flushAll() {
    return of(null);
  }
}
