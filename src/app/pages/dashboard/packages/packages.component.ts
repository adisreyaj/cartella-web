import { Component, OnInit } from '@angular/core';
import { DeletePromptComponent } from '@app/components/delete-prompt/delete-prompt.component';
import { LoggedUser, User } from '@app/interfaces/user.interface';
import { MenuService } from '@app/services/menu/menu.service';
import { ToastService } from '@app/services/toast/toast.service';
import { WithDestroy } from '@app/services/with-destroy/with-destroy';
import { UserState } from '@app/store/states/user.state';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { has } from 'lodash-es';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, finalize, pluck, switchMap, take } from 'rxjs/operators';
import {
  ExplorerSidebarEvent,
  ExplorerSidebarEventType,
} from '../shared/components/explorer-sidebar/explorer-sidebar.component';
import { PackagesAddFolderComponent } from './components/modals/packages-add-folder/packages-add-folder.component';
import { ALL_PACKAGES_FOLDER } from './shared/config/packages.config';
import { Package, PackageFolder } from './shared/interfaces/packages.interface';
import { PackageHelperService } from './shared/services/package-helper.service';
import {
  DeletePackageFolder,
  GetPackageFolders,
  SetActivePackageFolder,
} from './store/actions/package-folders.action';
import { GetPackages } from './store/actions/package.action';
import { PackageFolderState } from './store/states/package-folders.state';
import { PackageState } from './store/states/package.state';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss'],
})
export class PackagesComponent extends WithDestroy implements OnInit {
  @Select(UserState.getLoggedInUser)
  user$: Observable<LoggedUser>;

  @Select(PackageState.getAllPackages)
  allPackages$: Observable<Package[]>;

  @Select(PackageFolderState.getAllPackageFolders)
  allPackageFolders$: Observable<PackageFolder[]>;

  @Select(PackageState.isPackageFetched)
  packageFetched$: Observable<Package[]>;

  @Select(PackageState.getPackagesShown)
  packagesShown$: Observable<Package[]>;

  @Select(PackageState.getActivePackage)
  activePackage$: Observable<Package>;

  @Select(PackageFolderState.getAllPackageFolders)
  folders$: Observable<PackageFolder[]>;

  @Select(PackageFolderState.getActivePackageFolder)
  activeFolder$: Observable<PackageFolder>;

  private packageFolderLoadingSubject = new BehaviorSubject(false);
  packageFolderLoading$ = this.packageFolderLoadingSubject.pipe();

  private packageLoadingSubject = new BehaviorSubject(false);
  packageLoading$ = this.packageLoadingSubject.pipe();

  isMenuOpen$: Observable<boolean>;

  constructor(
    private store: Store,
    private menu: MenuService,
    private dialog: DialogService,
    private toaster: ToastService,
    private helper: PackageHelperService
  ) {
    super();
  }

  ngOnInit(): void {
    const sub = this.getDataFromAPI()
      .pipe(switchMap(() => this.updatePackagesWhenActiveFolderChanges()))
      .subscribe(() => {
        this.updatePackageFoldersInIDB();
        this.updatePackagesInIDB();
      });
    this.isMenuOpen$ = this.menu.isMenuOpen$;
    this.subs.add(sub);
  }

  closeMenu() {
    this.menu.closeMenu();
  }

  handleSidebarEvent({ type, data }: ExplorerSidebarEvent) {
    switch (type) {
      case ExplorerSidebarEventType.select:
        this.handleSelectFolder(data);
        break;
      case ExplorerSidebarEventType.edit:
        this.handleEditFolder(data);
        break;
      case ExplorerSidebarEventType.createFolder:
        this.handleCreateFolder();
        break;
      case ExplorerSidebarEventType.delete:
        this.handleDeleteFolder(data);
        break;
      case ExplorerSidebarEventType.closeMenu:
        this.closeMenu();
        break;
    }
  }

  handleSelectFolder(folder: PackageFolder) {
    if (folder) {
      this.packageLoadingSubject.next(true);
      this.store.dispatch(new SetActivePackageFolder(folder));
    }
  }

  handleEditFolder(folder: PackageFolder) {
    this.dialog.open(PackagesAddFolderComponent, {
      size: 'sm',
      data: {
        folder,
        owner: this.store.selectSnapshot<User>(UserState.getLoggedInUser)?.id,
      },
      enableClose: false,
    });
  }

  handleDeleteFolder(folder: PackageFolder) {
    const dialogRef = this.dialog.open(DeletePromptComponent, {
      size: 'sm',
      minHeight: 'unset',
    });
    this.subs.add(
      dialogRef.afterClosed$
        .pipe(
          filter((allowDelete) => allowDelete),
          switchMap(() =>
            this.store.dispatch(new DeletePackageFolder(folder.id))
          )
        )
        .subscribe(
          () => {
            this.toaster.showSuccessToast('Folder deleted successfully!');
          },
          (err) => {
            if (has(err, 'error.message')) {
              this.toaster.showErrorToast(err.error.message);
            } else {
              this.toaster.showErrorToast('Folder was not deleted!');
            }
          }
        )
    );
  }

  handleCreateFolder() {
    this.dialog.open(PackagesAddFolderComponent, {
      size: 'sm',
      data: {
        owner: this.store.selectSnapshot<User>(UserState.getLoggedInUser)?.id,
      },
      enableClose: false,
    });
  }

  private getDataFromAPI() {
    this.packageLoadingSubject.next(true);
    return combineLatest([this.getPackages(), this.getPackageFolders()]).pipe(
      switchMap(([bookmarks, folders]) =>
        combineLatest([
          this.helper.updatePackagesInIDB(bookmarks, folders),
          this.helper.updatePackageFoldersInDb(folders),
        ])
      ),
      finalize(() => {
        this.packageLoadingSubject.next(false);
      })
    );
  }

  private getPackages() {
    return (
      this.store
        .dispatch(new GetPackages(ALL_PACKAGES_FOLDER.id))
        // Get packages from state
        .pipe(pluck('packages', 'allPackages'))
    );
  }

  private getPackageFolders() {
    return this.store.dispatch(new GetPackageFolders()).pipe(
      switchMap(() =>
        this.store.dispatch(new SetActivePackageFolder(ALL_PACKAGES_FOLDER))
      ),
      // Get package folders from state
      pluck('packageFolders', 'packageFolders')
    );
  }

  private updatePackagesWhenActiveFolderChanges() {
    return this.activeFolder$.pipe(
      pluck('id'),
      switchMap((folderId) => this.store.dispatch(new GetPackages(folderId)))
    );
  }

  private updatePackagesInIDB() {
    const sub = combineLatest([
      this.allPackages$,
      this.allPackageFolders$.pipe(take(1)),
    ])
      .pipe(
        switchMap(([packages, folders]) =>
          this.helper.updatePackagesInIDB(packages, folders)
        )
      )
      .subscribe();
    this.subs.add(sub);
  }

  private updatePackageFoldersInIDB() {
    const sub = this.allPackageFolders$
      .pipe(
        filter((res) => res.length > 0),
        switchMap((folders) => this.helper.updatePackageFoldersInDb(folders))
      )
      .subscribe();
    this.subs.add(sub);
  }
}
