import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconModule } from '@app/modules/icon/icon.module';
import { TippyModule } from '@ngneat/helipopper';
import { HoveredDirectiveModule } from 'src/app/shared/directives/hovered/hovered-directive.module';
import { ExplorerSidebarComponent } from './explorer-sidebar.component';

@NgModule({
  declarations: [ExplorerSidebarComponent],
  imports: [CommonModule, IconModule, TippyModule, HoveredDirectiveModule],
  exports: [ExplorerSidebarComponent],
})
export class ExplorerSidebarModule {}
