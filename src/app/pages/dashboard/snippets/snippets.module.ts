import { ClipboardModule } from '@angular/cdk/clipboard';
import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@app/components/components.module';
import { MoveToFolderModule } from '@app/components/move-to-folder/move-to-folder.module';
import { FeatureDirectiveModule } from '@app/directives/feature/feature.module';
import { HoveredDirectiveModule } from '@app/directives/hovered/hovered-directive.module';
import { FeatureType } from '@app/interfaces/general.interface';
import { IconModule } from '@app/modules/icon/icon.module';
import { LanguagePipeModule } from '@app/pipes/language-pipe/language-pipe.module';
import { TimeAgoPipeModule } from '@app/pipes/time-ago-pipe/time-ago-pipe.module';
import { MenuService } from '@app/services/menu/menu.service';
import { FEATURE_TOKEN } from '@app/tokens/feature.token';
import { NgSelectModule } from '@ng-select/ng-select';
import { DialogModule } from '@ngneat/dialog';
import { TippyModule } from '@ngneat/helipopper';
import { ButtonsModule } from 'projects/ui/src/public-api';
import { ExplorerSidebarModule } from '../shared/components/explorer-sidebar/explorer-sidebar.module';
import { SnippetsAddFolderComponent } from './components/modals/snippets-add-folder/snippets-add-folder.component';
import { SnippetsScreenshotComponent } from './components/modals/snippets-screenshot/snippets-screenshot.component';
import { SnippetsPlaygroundComponent } from './components/snippets-playground/snippets-playground.component';
import { SnippetsSidebarComponent } from './components/snippets-sidebar/snippets-sidebar.component';
import { ThemeVariantPipe } from './shared/pipes/theme-variant.pipe';
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
    ComponentsModule,
    HoveredDirectiveModule,
    ExplorerSidebarModule,
    TippyModule,
    TimeAgoPipeModule,
    LayoutModule,
    FeatureDirectiveModule,
  ],
  providers: [
    MenuService,
    {
      provide: FEATURE_TOKEN,
      useValue: FeatureType.bookmark,
    },
  ],
})
export class SnippetsModule {}
