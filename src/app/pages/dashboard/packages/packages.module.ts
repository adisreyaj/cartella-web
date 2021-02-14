import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@app/modules/icon/icon.module';
import { CountPipeModule } from '@app/pipes/count-pipe/count-pipe.module';
import { MenuService } from '@app/services/menu/menu.service';
import { DialogModule } from '@ngneat/dialog';
import { TippyModule } from '@ngneat/helipopper';
import { NgxFilesizeModule } from 'ngx-filesize';
import { ButtonsModule } from 'projects/ui/src/public-api';
import { ExplorerSidebarModule } from '../shared/components/explorer-sidebar/explorer-sidebar.module';
import { PackagesAddFolderComponent } from './components/modals/packages-add-folder/packages-add-folder.component';
import { PackagesAddComponent } from './components/modals/packages-add/packages-add.component';
import { PackagesListCardComponent } from './components/packages-list/packages-list-card/packages-list-card.component';
import { PackagesListComponent } from './components/packages-list/packages-list.component';
import { PackagesRoutingModule } from './packages-routing.module';
import { PackagesComponent } from './packages.component';

@NgModule({
  declarations: [
    PackagesComponent,
    PackagesAddFolderComponent,
    PackagesAddComponent,
    PackagesListComponent,
    PackagesListCardComponent,
  ],
  imports: [
    CommonModule,
    PackagesRoutingModule,
    ExplorerSidebarModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonsModule,
    IconModule,
    TippyModule,
    NgxFilesizeModule,
    CountPipeModule,
  ],
  providers: [MenuService],
})
export class PackagesModule {}
