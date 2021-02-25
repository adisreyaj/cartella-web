import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MoveToFolderModule } from '@app/components/move-to-folder/move-to-folder.module';
import { DefaultImageModule } from '@app/directives/default-image/default-image.module';
import { FeatureDirectiveModule } from '@app/directives/feature/feature.module';
import { IconModule } from '@app/modules/icon/icon.module';
import { MenuService } from '@app/services/menu/menu.service';
import { DialogModule } from '@ngneat/dialog';
import { TippyModule } from '@ngneat/helipopper';
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
  ],
  providers: [MenuService],
})
export class BookmarksModule {}
