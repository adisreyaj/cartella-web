import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeatureType } from '@cartella/interfaces/general.interface';
import { FEATURE_TOKEN } from '@cartella/tokens/feature.token';
import {
  ButtonsModule,
  DeletePromptModule,
  ExplorerSidebarModule,
  MoveToFolderModule,
  SharePopupModule,
} from '@cartella/ui/components';
import { DefaultImageModule, FeatureDirectiveModule, HoveredDirectiveModule } from '@cartella/ui/directives';
import { IconModule } from '@cartella/ui/modules';
import { IsOwnerModule, IsSharedItemModule } from '@cartella/ui/pipes';
import { BaseStorageService, IDBSyncService, MenuService } from '@cartella/ui/services';
import { DialogModule } from '@ngneat/dialog';
import { TippyModule } from '@ngneat/helipopper';
import { NgxsModule } from '@ngxs/store';
import { BookmarksRoutingModule } from './bookmarks-routing.module';
import { BookmarksComponent } from './bookmarks.component';
import { BookmarksListCardComponent } from './components/bookmarks-list-card/bookmarks-list-card.component';
import { BookmarksListComponent } from './components/bookmarks-list/bookmarks-list.component';
import { BookmarksAddFolderComponent } from './components/modals/bookmarks-add-folder/bookmarks-add-folder.component';
import { BookmarkAddPreviewComponent } from './components/modals/bookmarks-add/bookmark-add-preview/bookmark-add-preview.component';
import { BookmarksAddComponent } from './components/modals/bookmarks-add/bookmarks-add.component';
import { BookmarkStorageService } from './shared/services/bookmark-storage.service';
import { BookmarkFolderState } from './shared/store/states/bookmark-folders.state';
import { BookmarkState } from './shared/store/states/bookmarks.state';

@NgModule({
  declarations: [
    BookmarksComponent,
    BookmarksAddFolderComponent,
    BookmarksAddComponent,
    BookmarksListComponent,
    BookmarksListCardComponent,
    BookmarkAddPreviewComponent,
  ],
  imports: [
    CommonModule,
    BookmarksRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    ButtonsModule,
    DialogModule,
    HoveredDirectiveModule,
    TippyModule,
    ClipboardModule,
    ExplorerSidebarModule,
    DefaultImageModule,
    FeatureDirectiveModule,
    MoveToFolderModule,
    SharePopupModule,
    DeletePromptModule,
    NgxsModule.forFeature([BookmarkState, BookmarkFolderState]),
    IsOwnerModule,
    IsSharedItemModule,
  ],
  providers: [
    MenuService,
    {
      provide: BaseStorageService,
      useClass: BookmarkStorageService,
    },
    {
      provide: FEATURE_TOKEN,
      useValue: FeatureType.bookmark,
    },
    IDBSyncService,
  ],
})
export class BookmarksModule {}
