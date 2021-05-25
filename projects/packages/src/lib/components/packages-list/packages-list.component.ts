import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DeletePromptComponent } from '@cartella/components/delete-prompt/delete-prompt.component';
import { MoveToFolderComponent } from '@cartella/components/move-to-folder/move-to-folder.component';
import { SharePopupComponent } from '@cartella/components/share-popup/share-popup.component';
import { FeatureType } from '@cartella/interfaces/general.interface';
import { MoveToFolderModalPayload } from '@cartella/interfaces/move-to-folder.interface';
import { User } from '@cartella/interfaces/user.interface';
import { IDBSyncService } from '@cartella/services/idb-sync-service/idb-sync.service';
import { MenuService } from '@cartella/services/menu/menu.service';
import { WithDestroy } from '@cartella/services/with-destroy/with-destroy';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { HomeState } from '../../../../../../src/app/pages/dashboard/home/shared/store/states/home.state';
import {
  Package,
  PackageCardEvent,
  PackageCardEventType,
  PackageFolder,
} from '../../shared/interfaces/packages.interface';
import { DeletePackage, GetPackages, UpdatePackage } from '../../shared/store/actions/package.action';
import { PackageFolderState } from '../../shared/store/states/package-folders.state';
import { PackageState } from '../../shared/store/states/package.state';
import { PackagesAddComponent } from '../modals/packages-add/packages-add.component';

@Component({
  selector: 'app-packages-list',
  templateUrl: './packages-list.component.html',
  styleUrls: ['./packages-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackagesListComponent extends WithDestroy implements OnInit {
  @Input() user: User | null = null;
  @Input() activeFolder: PackageFolder | null = null;
  @Input() folders: PackageFolder[] | null = [];
  @Input() packages: Package[] | null = [];
  @Input() isLoading: boolean | null = false;

  packagesCount = new Array(this.store.selectSnapshot(HomeState.getItemsCount)?.items?.packages || 1).fill('');

  @Select(PackageFolderState.getActivePackageFolder)
  activeFolder$: Observable<PackageFolder>;

  @Select(PackageFolderState.getAllPackageFolders)
  folders$: Observable<PackageFolder[]>;

  @Select(PackageState.getAllPackages)
  packages$: Observable<Package[]>;

  @Select(PackageState.isPackageFetched)
  fetched$: Observable<boolean>;

  constructor(
    private dialog: DialogService,
    private store: Store,
    private menu: MenuService,
    private syncService: IDBSyncService,
  ) {
    super();
  }

  ngOnInit(): void {}

  toggleMenu() {
    this.menu.toggleMenu();
  }

  trackBy(_: number, { id }: { id: string }) {
    return id;
  }
  addNewPackage() {
    const dialogRef = this.dialog.open(PackagesAddComponent, {
      size: 'md',
      minHeight: 'unset',
      data: {
        user: this.user,
        folder: this.activeFolder,
        folders: this.folders,
      },
      enableClose: false,
    });
  }

  handleCardEvent({ type, package: packageData }: PackageCardEvent) {
    const { id, favorite } = packageData;
    switch (type) {
      case PackageCardEventType.favorite:
        this.store.dispatch(new UpdatePackage(id, { favorite: !favorite }));
        break;
      case PackageCardEventType.edit:
        break;
      case PackageCardEventType.delete:
        this.handleDelete(packageData);
        break;
      case PackageCardEventType.move:
        this.handleMoveToFolder(packageData);
        break;
      case PackageCardEventType.share:
        this.handleShare(packageData);
        break;
      default:
        break;
    }
  }

  private handleMoveToFolder(packageData: Package) {
    const dialogRef = this.dialog.open<MoveToFolderModalPayload>(MoveToFolderComponent, {
      size: 'sm',
      minHeight: 'unset',
      data: {
        type: FeatureType.bookmark,
        action: UpdatePackage,
        item: packageData,
        folders: this.folders$
          ? this.folders$.pipe(map((folders) => folders.filter(({ id }) => id !== packageData.folder.id)))
          : of([]),
      },
      enableClose: false,
    });
    this.subs.add(
      dialogRef.afterClosed$
        .pipe(
          switchMap(() => combineLatest([this.packages$ ?? of([]), this.folders$ ?? of([])])),
          take(1),
          switchMap(([packages, folders]) => this.syncService.syncItems(packages, folders)),
          switchMap(() => {
            const activePackageFolder = this.store.selectSnapshot(PackageFolderState.getActivePackageFolder);
            if (activePackageFolder) {
              return this.store.dispatch(new GetPackages(activePackageFolder.id));
            }
            return of(null);
          }),
        )
        .subscribe(() => {}),
    );
  }

  private handleDelete({ id }: Package) {
    const dialogRef = this.dialog.open(DeletePromptComponent, {
      size: 'sm',
      minHeight: 'unset',
    });
    this.subs.add(
      dialogRef.afterClosed$
        .pipe(
          tap((response) => {
            if (response) {
              this.store.dispatch(new DeletePackage(id));
            }
          }),
        )
        .subscribe(() => {}),
    );
  }

  private handleShare(packageItem: Package) {
    const dialogRef = this.dialog.open(SharePopupComponent, {
      size: 'md',
      minHeight: 'unset',
      data: {
        entity: 'Package',
        item: packageItem,
      },
    });
    this.subs.add(
      dialogRef.afterClosed$
        .pipe(
          tap((response) => {
            if (response) {
            }
          }),
        )
        .subscribe(() => {}),
    );
  }
}
