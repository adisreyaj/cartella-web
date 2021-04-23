import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MoveToFolderModule } from '@app/components/move-to-folder/move-to-folder.module';
import { SharePopupModule } from '@app/components/share-popup/share-popup.module';
import { DefaultImageModule } from '@app/directives/default-image/default-image.module';
import { FeatureDirectiveModule } from '@app/directives/feature/feature.module';
import { FeatureType } from '@app/interfaces/general.interface';
import { IconModule } from '@app/modules/icon/icon.module';
import { IDBSyncService } from '@app/services/idb-sync-service/idb-sync.service';
import { MenuService } from '@app/services/menu/menu.service';
import { BaseStorageService } from '@app/services/storage/base-storage.service';
import { FEATURE_TOKEN } from '@app/tokens/feature.token';
import { DialogModule } from '@ngneat/dialog';
import { TippyModule } from '@ngneat/helipopper';
import { NgxsModule } from '@ngxs/store';
import { ButtonsModule } from 'projects/ui/src/public-api';
import { HoveredDirectiveModule } from 'src/app/shared/directives/hovered/hovered-directive.module';
import { ExplorerSidebarModule } from '../shared/components/explorer-sidebar/explorer-sidebar.module';
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
    NgxsModule.forFeature([BookmarkState, BookmarkFolderState]),
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
