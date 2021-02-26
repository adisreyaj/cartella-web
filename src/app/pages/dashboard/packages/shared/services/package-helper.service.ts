import { Injectable } from '@angular/core';
import { StorageFolders } from '@app/services/storage/storage.interface';
import { StorageService } from '@app/services/storage/storage.service';
import { combineLatest, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Package, PackageFolder } from '../interfaces/packages.interface';

@Injectable({
  providedIn: 'root',
})
export class PackageHelperService {
  constructor(private storage: StorageService) {}

  /**
   * Update the packages in the Indexed DB
   *
   * @param packages - all packages
   * @param packageFolders - all package folders
   */
  updatePackagesInIDB(packages: Package[], packageFolders: PackageFolder[]) {
    if (packages != null && packageFolders != null) {
      return combineLatest([
        this.saveStarredPackages(packages),
        this.savePackagesInIDB(
          this.groupPackagesInFolders(packageFolders, packages)
        ),
      ]).pipe(catchError(() => throwError(new Error(''))));
    }
    return throwError(new Error(''));
  }

  updatePackageFoldersInDb(packageFolders: PackageFolder[]) {
    if (packageFolders != null) {
      return this.savePackageFoldersInIDB(packageFolders);
    }
  }

  private savePackagesInIDB = (foldersWithPackages: {
    [key: string]: Package[];
  }) =>
    Object.keys(foldersWithPackages).map((key) =>
      this.storage.setItem(
        StorageFolders.packages,
        key,
        foldersWithPackages[key]
      )
    );

  private savePackageFoldersInIDB = (folders: PackageFolder[]) =>
    this.storage.setItem(StorageFolders.folders, 'packages', folders);

  private saveStarredPackages = (packages: Package[]) =>
    this.storage.setItem(
      StorageFolders.packages,
      'starred',
      packages.filter(({ favorite }) => favorite)
    );

  /**
   * Group packages based on the folder
   *
   * ```json
   * 'id': [{},{}]
   * ```
   */
  private groupPackagesInFolders = (
    folders: PackageFolder[],
    packages: Package[]
  ) => {
    if (folders != null) {
      return folders.reduce(
        (acc, { id }) => ({
          ...acc,
          [id]: packages.filter(
            ({ folder: { id: folderId } }) => folderId === id
          ),
        }),
        {}
      );
    }
    return [];
  };
}
