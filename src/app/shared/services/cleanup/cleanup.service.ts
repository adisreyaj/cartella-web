import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '@cartella/tokens/window.token';

@Injectable({
  providedIn: 'root',
})
export class CleanupService {
  constructor(@Inject(WINDOW) private window: Window) {}

  cleanUpLocalSyncedData() {
    this.window.indexedDB.deleteDatabase('cartella');
  }
}
