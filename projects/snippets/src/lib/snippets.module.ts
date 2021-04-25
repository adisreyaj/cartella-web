import { ClipboardModule } from '@angular/cdk/clipboard';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeletePromptModule } from '@cartella/components/delete-prompt/delete-prompt.module';
import { ExplorerSidebarModule } from '@cartella/components/explorer-sidebar/explorer-sidebar.module';
import { MoveToFolderModule } from '@cartella/components/move-to-folder/move-to-folder.module';
import { SharePopupModule } from '@cartella/components/share-popup/share-popup.module';
import { FeatureDirectiveModule } from '@cartella/directives/feature/feature.module';
import { HoveredDirectiveModule } from '@cartella/directives/hovered/hovered-directive.module';
import { FeatureType } from '@cartella/interfaces/general.interface';
import { IconModule } from '@cartella/modules/icon/icon.module';
import { IsSharedItemModule } from '@cartella/pipes/is-shared-item/is-shared-item.module';
import { LanguagePipeModule } from '@cartella/pipes/language-pipe/language-pipe.module';
import { TimeAgoPipeModule } from '@cartella/pipes/time-ago-pipe/time-ago-pipe.module';
import { IDBSyncService } from '@cartella/services/idb-sync-service/idb-sync.service';
import { MenuService } from '@cartella/services/menu/menu.service';
import { BaseStorageService } from '@cartella/services/storage/base-storage.service';
import { FEATURE_TOKEN } from '@cartella/tokens/feature.token';
import { ButtonsModule } from '@cartella/ui';
import { NgSelectModule } from '@ng-select/ng-select';
import { DialogModule } from '@ngneat/dialog';
import { TippyModule } from '@ngneat/helipopper';
import { NgxsModule } from '@ngxs/store';
import { SnippetsAddFolderComponent } from './components/modals/snippets-add-folder/snippets-add-folder.component';
import { SnippetsScreenshotComponent } from './components/modals/snippets-screenshot/snippets-screenshot.component';
import { SnippetsPlaygroundComponent } from './components/snippets-playground/snippets-playground.component';
import { SnippetsSidebarComponent } from './components/snippets-sidebar/snippets-sidebar.component';
import { ThemeVariantPipe } from './shared/pipes/theme-variant.pipe';
import { SnippetStorageService } from './shared/services/snippet-storage.service';
import { SnippetFolderState } from './shared/store/states/snippet-folders.state';
import { SnippetState } from './shared/store/states/snippets.state';
import { SnippetsRoutingModule } from './snippets-routing.module';
import { SnippetsComponent } from './snippets.component';

@NgModule({
  declarations: [
    SnippetsComponent,
    SnippetsSidebarComponent,
    SnippetsPlaygroundComponent,
    SnippetsAddFolderComponent,
    SnippetsScreenshotComponent,
    ThemeVariantPipe,
  ],
  imports: [
    CommonModule,
    SnippetsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    ButtonsModule,
    NgSelectModule,
    ClipboardModule,
    LanguagePipeModule,
    DialogModule,
    MoveToFolderModule,
    HoveredDirectiveModule,
    ExplorerSidebarModule,
    TippyModule,
    TimeAgoPipeModule,
    LayoutModule,
    FeatureDirectiveModule,
    SharePopupModule,
    DeletePromptModule,
    IsSharedItemModule,
    NgxsModule.forFeature([SnippetState, SnippetFolderState]),
  ],
  providers: [
    MenuService,
    {
      provide: BaseStorageService,
      useClass: SnippetStorageService,
    },
    {
      provide: FEATURE_TOKEN,
      useValue: FeatureType.snippet,
    },
    IDBSyncService,
  ],
})
export class SnippetsModule {}
