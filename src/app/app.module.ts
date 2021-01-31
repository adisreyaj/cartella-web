import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconModule } from '@app/modules/icon/icon.module';
import { TechnologyState } from '@app/store/states/technology.state';
import { DialogModule } from '@ngneat/dialog';
import {
  popperVariation,
  TippyModule,
  tooltipVariation,
} from '@ngneat/helipopper';
import { TippyConfig } from '@ngneat/helipopper/lib/tippy.types';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookmarkFolderState } from './pages/dashboard/bookmarks/shared/store/states/bookmark-folders.state';
import { BookmarkState } from './pages/dashboard/bookmarks/shared/store/states/bookmarks.state';
import { SnippetFolderState } from './pages/dashboard/snippets/store/states/snippet-folders.state';
import { SnippetState } from './pages/dashboard/snippets/store/states/snippets.state';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';

const tippyConfig: Partial<TippyConfig> = {
  defaultVariation: 'tooltip',
  variations: {
    tooltip: tooltipVariation,
    popper: popperVariation,
    menu: {
      ...popperVariation,
      role: 'dropdown',
      arrow: false,
      hideOnClick: true,
      zIndex: 99,
    },
  },
};

const firebaseConfig = {
  apiKey: 'AIzaSyAgVpSqG91sy8ZZpYfTHjwlF5ydxZWUzJc',
  authDomain: 'cartella-2021.firebaseapp.com',
  projectId: 'cartella-2021',
  storageBucket: 'cartella-2021.appspot.com',
  messagingSenderId: '359576304939',
  appId: '1:359576304939:web:5db0dc5cb8013bfb87196e',
};
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IconModule,
    DialogModule.forRoot({
      windowClass: 'cartella-dialog',
    }),
    TippyModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
    }),
    TippyModule.forRoot(tippyConfig),
    NgxsModule.forRoot([
      SnippetState,
      TechnologyState,
      SnippetFolderState,
      BookmarkState,
      BookmarkFolderState,
    ]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    // NgxsLoggerPluginModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
