import { Injectable } from '@angular/core';
import { DedicatedInstanceFactory } from 'ngforage';
import { BaseStorageService } from './base-storage.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService extends BaseStorageService {
  constructor(private dif: DedicatedInstanceFactory) {
    super(
      dif.createNgForage({
        name: 'cartella',
        storeName: 'GENERAL',
      })
    );
  }
}
