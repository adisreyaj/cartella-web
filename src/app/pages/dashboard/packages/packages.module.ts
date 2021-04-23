import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MoveToFolderModule } from '@app/components/move-to-folder/move-to-folder.module';
import { FeatureDirectiveModule } from '@app/directives/feature/feature.module';
import { FeatureType } from '@app/interfaces/general.interface';
import { IconModule } from '@app/modules/icon/icon.module';
import { CountPipeModule } from '@app/pipes/count-pipe/count-pipe.module';
import { IDBSyncService } from '@app/services/idb-sync-service/idb-sync.service';
import { MenuService } from '@app/services/menu/menu.service';
import { BaseStorageService } from '@app/services/storage/base-storage.service';
import { FEATURE_TOKEN } from '@app/tokens/feature.token';
import { DialogModule } from '@ngneat/dialog';
import { TippyModule } from '@ngneat/helipopper';
import { NgxsModule } from '@ngxs/store';
import { NgxFilesizeModule } from 'ngx-filesize';
import { ButtonsModule } from 'projects/ui/src/public-api';
import { ExplorerSidebarModule } from '../shared/components/explorer-sidebar/explorer-sidebar.module';
import { PackagesAddFolderComponent } from './components/modals/packages-add-folder/packages-add-folder.component';
import { PackagesAddComponent } from './components/modals/packages-add/packages-add.component';
import { PackagesListCardComponent } from './components/packages-list-card/packages-list-card.component';
import { PackagesListComponent } from './components/packages-list/packages-list.component';
import { PackagesRoutingModule } from './packages-routing.module';
import { PackagesComponent } from './packages.component';
import { PackageStorageService } from './shared/services/package-storage.service';
import { PackageFolderState } from './store/states/package-folders.state';
import { PackageState } from './store/states/package.state';

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
    FeatureDirectiveModule,
    MoveToFolderModule,
    NgxsModule.forFeature([PackageState, PackageFolderState]),
  ],
  providers: [
    MenuService,
    {
      provide: FEATURE_TOKEN,
      useValue: FeatureType.bookmark,
    },
    {
      provide: BaseStorageService,
      useClass: PackageStorageService,
    },
    IDBSyncService,
  ],
})
export class PackagesModule {}
