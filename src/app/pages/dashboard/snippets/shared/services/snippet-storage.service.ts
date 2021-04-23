import { Injectable } from '@angular/core';
import { BaseStorageService } from '@app/services/storage/base-storage.service';
import { StorageFolders } from '@app/services/storage/storage.interface';
import { DedicatedInstanceFactory } from 'ngforage';

@Injectable({
  providedIn: 'root',
})
export class SnippetStorageService extends BaseStorageService {
  constructor(private dif: DedicatedInstanceFactory) {
    super(
      dif.createNgForage({
        name: 'cartella',
        storeName: StorageFolders.snippets,
      })
    );
  }
}
