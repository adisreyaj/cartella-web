import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/interfaces/user.interface';
import { AuthService } from '@app/services/auth/auth.service';
import { DialogService } from '@ngneat/dialog';
import { Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { SubSink } from 'subsink';
import { PackagesAddFolderComponent } from './components/modals/packages-add-folder/packages-add-folder.component';
import { ALL_PACKAGES_FOLDER } from './shared/config/packages.config';
import { Package, PackageFolder } from './shared/interfaces/packages.interface';
import { PackagesService } from './shared/services/packages.service';
import {
  GetPackageFolders,
  SetActivePackageFolder,
} from './store/actions/package-folders.action';
import { GetPackages } from './store/actions/package.action';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss'],
})
export class PackagesComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  activeFolder$: Observable<PackageFolder>;
  packages$: Observable<Package[]>;

  user: User;
  private packagesBasedOnFolderSubject = new Subject<Package[]>();
  packagesBasedOnFolder$ = this.packagesBasedOnFolderSubject.pipe();
  folders$: Observable<PackageFolder[]>;
  constructor(
    private packageService: PackagesService,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
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
    }
  }

  handleEditFolder(folder: PackageFolder) {
    this.dialog.open(PackagesAddFolderComponent, {
      size: 'sm',
      data: {
        folder,
        owner: this.auth.user,
      },
      enableClose: false,
    });
  }
  handleCreateFolder() {
    this.dialog.open(PackagesAddFolderComponent, {
      size: 'sm',
      data: {
        owner: this.auth.user,
      },
      enableClose: false,
    });
  }

  private getPackages() {
    const folderState = this.store.selectSnapshot(
      (state) => state.snippetFolders
    );
    this.store.dispatch(new GetPackages(ALL_PACKAGES_FOLDER.id));
  }
  private getPackageFolders() {
    this.store.dispatch(new GetPackageFolders());
    this.store.dispatch(new SetActivePackageFolder(ALL_PACKAGES_FOLDER));
  }
}
