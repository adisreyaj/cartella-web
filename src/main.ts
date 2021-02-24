import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular';
/**
 * Hammerjs must be imported for gestures
 */
import 'hammerjs';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  Sentry.init({
    dsn:
      'https://2dec01bc43224cbe8d7dc096e0e2a4d2@o495177.ingest.sentry.io/5630709',
  });
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
