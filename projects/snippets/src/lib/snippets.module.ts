import { ClipboardModule } from '@angular/cdk/clipboard';
import { LayoutModule } from '@angular/cdk/layout';
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
import { FeatureDirectiveModule, FullscreenModule, HoveredDirectiveModule } from '@cartella/ui/directives';
import { IconModule } from '@cartella/ui/modules';
import {
  HasWriteAccessModule,
  IsOwnerModule,
  IsSharedItemModule,
  LanguagePipeModule,
  TimeAgoPipeModule,
} from '@cartella/ui/pipes';
import { BaseStorageService, IDBSyncService, MenuService } from '@cartella/ui/services';
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
    IsOwnerModule,
    HasWriteAccessModule,
    FullscreenModule,
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
