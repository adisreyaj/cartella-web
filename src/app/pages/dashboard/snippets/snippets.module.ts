import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HoveredDirectiveModule } from '@app/directives/hovered/hovered-directive.module';
import { IconModule } from '@app/modules/icon/icon.module';
import { LanguagePipeModule } from '@app/pipes/language-pipe/language-pipe.module';
import { TimeAgoPipeModule } from '@app/pipes/time-ago-pipe/time-ago-pipe.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DialogModule } from '@ngneat/dialog';
import { TippyModule } from '@ngneat/helipopper';
import { ButtonsModule } from 'projects/ui/src/public-api';
import { ExplorerSidebarModule } from '../shared/components/explorer-sidebar/explorer-sidebar.module';
import { SnippetsAddFolderComponent } from './components/modals/snippets-add-folder/snippets-add-folder.component';
import { SnippetsScreenshotComponent } from './components/modals/snippets-screenshot/snippets-screenshot.component';
import { SnippetsPlaygroundComponent } from './components/snippets-playground/snippets-playground.component';
import { SnippetsSidebarComponent } from './components/snippets-sidebar/snippets-sidebar.component';
import { SnippetsRoutingModule } from './snippets-routing.module';
import { SnippetsComponent } from './snippets.component';
@NgModule({
  declarations: [
    SnippetsComponent,
    SnippetsSidebarComponent,
    SnippetsPlaygroundComponent,
    SnippetsAddFolderComponent,
    SnippetsScreenshotComponent,
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
    HoveredDirectiveModule,
    ExplorerSidebarModule,
    TippyModule,
    TimeAgoPipeModule,
  ],
})
export class SnippetsModule {}
