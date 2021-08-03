import { Injectable } from '@angular/core';
import { BaseStorageService } from '@cartella/ui/services/storage/base-storage.service';
import { StorageFolders } from '@cartella/ui/services/storage/storage.interface';
import { DedicatedInstanceFactory } from 'ngforage';

@Injectable({
  providedIn: 'root',
})
export class PackageStorageService extends BaseStorageService {
  constructor(private dif: DedicatedInstanceFactory) {
    super(
      dif.createNgForage({
        name: 'cartella',
        storeName: StorageFolders.packages,
      })
    );
  }
}
