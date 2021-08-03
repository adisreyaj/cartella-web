import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HoveredDirectiveModule } from '@cartella/ui/directives';
import { IconModule } from '@cartella/ui/modules';
import { TippyModule } from '@ngneat/helipopper';
import { ExplorerSidebarComponent } from './explorer-sidebar.component';

@NgModule({
  declarations: [ExplorerSidebarComponent],
  imports: [CommonModule, IconModule, TippyModule, HoveredDirectiveModule],
  exports: [ExplorerSidebarComponent],
})
export class ExplorerSidebarModule {}
