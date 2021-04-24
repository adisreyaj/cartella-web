import { ClipboardModule } from '@angular/cdk/clipboard';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@cartella/components/components.module';
import { MoveToFolderModule } from '@cartella/components/move-to-folder/move-to-folder.module';
import { FeatureDirectiveModule } from '@cartella/directives/feature/feature.module';
import { HoveredDirectiveModule } from '@cartella/directives/hovered/hovered-directive.module';
import { FeatureType } from '@cartella/interfaces/general.interface';
import { IconModule } from '@cartella/modules/icon/icon.module';
import { LanguagePipeModule } from '@cartella/pipes/language-pipe/language-pipe.module';
import { TimeAgoPipeModule } from '@cartella/pipes/time-ago-pipe/time-ago-pipe.module';
import { IDBSyncService } from '@cartella/services/idb-sync-service/idb-sync.service';
import { MenuService } from '@cartella/services/menu/menu.service';
import { BaseStorageService } from '@cartella/services/storage/base-storage.service';
import { FEATURE_TOKEN } from '@cartella/tokens/feature.token';
import { NgSelectModule } from '@ng-select/ng-select';
import { DialogModule } from '@ngneat/dialog';
import { TippyModule } from '@ngneat/helipopper';
import { NgxsModule } from '@ngxs/store';
import { ButtonsModule } from 'projects/ui/src/public-api';
import { ExplorerSidebarModule } from '../shared/components/explorer-sidebar/explorer-sidebar.module';
import { SnippetsAddFolderComponent } from './components/modals/snippets-add-folder/snippets-add-folder.component';
import { SnippetsScreenshotComponent } from './components/modals/snippets-screenshot/snippets-screenshot.component';
import { SnippetsPlaygroundComponent } from './components/snippets-playground/snippets-playground.component';
import { SnippetsSidebarComponent } from './components/snippets-sidebar/snippets-sidebar.component';
import { ThemeVariantPipe } from './shared/pipes/theme-variant.pipe';
import { SnippetStorageService } from './shared/services/snippet-storage.service';
import { SnippetsRoutingModule } from './snippets-routing.module';
import { SnippetsComponent } from './snippets.component';
import { SnippetFolderState } from './store/states/snippet-folders.state';
import { SnippetState } from './store/states/snippets.state';

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
    ComponentsModule,
    HoveredDirectiveModule,
    ExplorerSidebarModule,
    TippyModule,
    TimeAgoPipeModule,
    LayoutModule,
    FeatureDirectiveModule,
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
