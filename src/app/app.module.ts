import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CartellaHammerConfig } from '@cartella/config/hammer.config';
import { IconModule } from '@cartella/modules/icon/icon.module';
import { ConfigurationService } from '@cartella/services/configuration/configuration.service';
import { BaseStorageService } from '@cartella/services/storage/base-storage.service';
import { StorageService } from '@cartella/services/storage/storage.service';
import { TagState } from '@cartella/store/states/tag.state';
import { TechnologyState } from '@cartella/store/states/technology.state';
import { UserState } from '@cartella/store/states/user.state';
import { NgSelectModule } from '@ng-select/ng-select';
import { DialogModule } from '@ngneat/dialog';
import { popperVariation, TippyModule, tooltipVariation, withContextMenuVariation } from '@ngneat/helipopper';
import { TippyConfig } from '@ngneat/helipopper/lib/tippy.types';
import { HotToastModule } from '@ngneat/hot-toast';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import * as Sentry from '@sentry/angular';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';

const tippyConfig: Partial<TippyConfig> = {
  defaultVariation: 'tooltip',
  variations: {
    tooltip: tooltipVariation,
    popper: popperVariation,
    contextMenu: withContextMenuVariation({ ...popperVariation, role: 'menu' }),
    menu: {
      ...popperVariation,
      role: 'dropdown',
      arrow: false,
      hideOnClick: true,
      zIndex: 99,
    },
  },
};

const configurationFactory = (configurationService: ConfigurationService) => () => configurationService.loadConfig();

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IconModule,
    HammerModule,
    DialogModule.forRoot({
      windowClass: 'cartella-dialog',
    }),
    NgSelectModule,
    TippyModule.forRoot(),
    TippyModule.forRoot(tippyConfig),
    NgxsModule.forRoot([UserState, TechnologyState, TagState], {
      developmentMode: !environment.production,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    HotToastModule.forRoot(),
  ],
  providers: [
    environment.production
      ? {
          provide: ErrorHandler,
          useValue: Sentry.createErrorHandler({
            showDialog: false,
            logErrors: !environment.production,
          }),
        }
      : [],
    {
      provide: APP_INITIALIZER,
      useFactory: configurationFactory,
      deps: [ConfigurationService],
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: CartellaHammerConfig,
    },
    {
      provide: BaseStorageService,
      useClass: StorageService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
