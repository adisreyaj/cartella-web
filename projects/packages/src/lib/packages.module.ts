import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeletePromptModule } from '@cartella/components/delete-prompt/delete-prompt.module';
import { ExplorerSidebarModule } from '@cartella/components/explorer-sidebar/explorer-sidebar.module';
import { MoveToFolderModule } from '@cartella/components/move-to-folder/move-to-folder.module';
import { SharePopupModule } from '@cartella/components/share-popup/share-popup.module';
import { FeatureDirectiveModule } from '@cartella/directives/feature/feature.module';
import { FeatureType } from '@cartella/interfaces/general.interface';
import { IconModule } from '@cartella/modules/icon/icon.module';
import { CountPipeModule } from '@cartella/pipes/count-pipe/count-pipe.module';
import { IDBSyncService } from '@cartella/services/idb-sync-service/idb-sync.service';
import { MenuService } from '@cartella/services/menu/menu.service';
import { BaseStorageService } from '@cartella/services/storage/base-storage.service';
import { FEATURE_TOKEN } from '@cartella/tokens/feature.token';
import { ButtonsModule } from '@cartella/ui';
import { DialogModule } from '@ngneat/dialog';
import { TippyModule } from '@ngneat/helipopper';
import { NgxsModule } from '@ngxs/store';
import { NgxFilesizeModule } from 'ngx-filesize';
import { PackagesAddFolderComponent } from './components/modals/packages-add-folder/packages-add-folder.component';
import { PackagesAddComponent } from './components/modals/packages-add/packages-add.component';
import { PackagesListCardComponent } from './components/packages-list-card/packages-list-card.component';
import { PackagesListComponent } from './components/packages-list/packages-list.component';
import { PackagesRoutingModule } from './packages-routing.module';
import { PackagesComponent } from './packages.component';
import { PackageStorageService } from './shared/services/package-storage.service';
import { PackageFolderState } from './shared/store/states/package-folders.state';
import { PackageState } from './shared/store/states/package.state';

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
    SharePopupModule,
    DeletePromptModule,
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
