import { Component, OnInit } from '@angular/core';
import { LoggedUser, User } from '@app/interfaces/user.interface';
import { MenuService } from '@app/services/menu/menu.service';
import { StorageService } from '@app/services/storage/storage.service';
import { WithDestroy } from '@app/services/with-destroy/with-destroy';
import { UserState } from '@app/store/states/user.state';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, pluck, switchMap, take } from 'rxjs/operators';
import { PackagesAddFolderComponent } from './components/modals/packages-add-folder/packages-add-folder.component';
import { ALL_PACKAGES_FOLDER } from './shared/config/packages.config';
import { Package, PackageFolder } from './shared/interfaces/packages.interface';
import { PackageHelperService } from './shared/services/package-helper.service';
import {
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
    private storage: StorageService,
    private helper: PackageHelperService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getPackageFolders();
    this.getPackages();
    this.updatePackagesWhenActiveFolderChanges();
    this.updatePackageFoldersInIDB();
    this.updatePackagesInIDB();
    this.isMenuOpen$ = this.menu.isMenuOpen$;
  }

  closeMenu() {
    this.menu.closeMenu();
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

  handleCreateFolder() {
    this.dialog.open(PackagesAddFolderComponent, {
      size: 'sm',
      data: {
        owner: this.store.selectSnapshot<User>(UserState.getLoggedInUser)?.id,
      },
      enableClose: false,
    });
  }

  private getPackages() {
    this.packageLoadingSubject.next(true);
    const sub = this.store
      .dispatch(new GetPackages(ALL_PACKAGES_FOLDER.id))
      .subscribe(
        () => {
          this.packageLoadingSubject.next(false);
        },
        () => {
          this.packageLoadingSubject.next(false);
        }
      );
    this.subs.add(sub);
  }

  private getPackageFolders() {
    this.packageFolderLoadingSubject.next(true);
    const sub = this.store.dispatch(new GetPackageFolders()).subscribe(
      () => {
        this.packageFolderLoadingSubject.next(false);
      },
      () => {
        this.packageFolderLoadingSubject.next(false);
      }
    );
    this.subs.add(sub);
    this.store.dispatch(new SetActivePackageFolder(ALL_PACKAGES_FOLDER));
  }

  private updatePackagesWhenActiveFolderChanges() {
    const sub = this.activeFolder$
      .pipe(
        pluck('id'),
        switchMap((folderId) => this.store.dispatch(new GetPackages(folderId)))
      )
      .subscribe(
        () => {
          this.packageLoadingSubject.next(false);
        },
        () => {
          this.packageLoadingSubject.next(false);
        }
      );
    this.subs.add(sub);
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
