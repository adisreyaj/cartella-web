import { Injectable } from '@angular/core';
import { BaseStorageService } from '@cartella/services/storage/base-storage.service';
import { StorageFolders } from '@cartella/services/storage/storage.interface';
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
      })
    );
  }
}