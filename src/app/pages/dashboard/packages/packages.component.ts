import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoggedUser, User } from '@app/interfaces/user.interface';
import { AuthService } from '@app/services/auth/auth.service';
import { UserState } from '@app/store/states/user.state';
import { DialogService } from '@ngneat/dialog';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { PackagesAddFolderComponent } from './components/modals/packages-add-folder/packages-add-folder.component';
import { ALL_PACKAGES_FOLDER } from './shared/config/packages.config';
import { Package, PackageFolder } from './shared/interfaces/packages.interface';
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
export class PackagesComponent implements OnInit, OnDestroy {
  @Select(UserState.getLoggedInUser)
  user$: Observable<LoggedUser>;

  @Select(PackageState.isPackageFetched)
  packageFetched$: Observable<Package[]>;

  @Select(PackageState.getAllPackages)
  allPackages$: Observable<Package[]>;

  @Select(PackageState.getPackagesShown)
  packagesShown$: Observable<Package[]>;

  @Select(PackageState.getActivePackage)
  activePackage$: Observable<Package>;

  @Select(PackageFolderState.getPackageFoldersList)
  folders$: Observable<PackageFolder[]>;

  @Select(PackageFolderState.getActivePackageFolder)
  activeFolder$: Observable<PackageFolder>;

  private packageFolderLoadingSubject = new BehaviorSubject(false);
  packageFolderLoading$ = this.packageFolderLoadingSubject.pipe();
  private subs = new SubSink();
  constructor(
    private store: Store,
    private auth: AuthService,
    private dialog: DialogService
  ) {}

  ngOnInit(): void {
    this.getPackageFolders();
    this.getPackages();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  handleSelectFolder(folder: PackageFolder) {
    if (folder) {
      this.store.dispatch(new SetActivePackageFolder(folder));
      this.store.dispatch(new GetPackages(folder.id));
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
    this.store.dispatch(new GetPackages(ALL_PACKAGES_FOLDER.id));
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
}
