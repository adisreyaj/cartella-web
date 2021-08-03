import { Injectable } from '@angular/core';
import { BaseStorageService, StorageFolders } from '@cartella/ui/services';
import { DedicatedInstanceFactory } from 'ngforage';

@Injectable({
  providedIn: 'root',
})
export class HomeStorageService extends BaseStorageService {
  constructor(private dif: DedicatedInstanceFactory) {
    super(
      dif.createNgForage({
        name: 'cartella',
        storeName: StorageFolders.count,
      }),
    );
  }
}
