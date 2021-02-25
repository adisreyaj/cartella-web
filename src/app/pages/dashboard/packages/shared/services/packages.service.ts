import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CARTELLA_ENDPOINTS,
  EXTERNAL_ENDPOINTS,
} from '@app/config/endpoints.config';
import { FolderOperations } from '@app/interfaces/folder.interface';
import { MoveToFolder } from '@app/interfaces/move-to-folder.interface';
import { PayloadResponse } from '@app/interfaces/response.interface';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PackageBundleMetaData } from '../interfaces/bundle.interface';
import { PackageSuggestions } from '../interfaces/package-details.interface';
import {
  Package,
  PackageFolder,
  PackageFolderRequest,
  PackageMetaData,
  PackageRequest,
} from '../interfaces/packages.interface';

@Injectable({
  providedIn: 'root',
})
export class PackagesService
  implements
    MoveToFolder<Package>,
    FolderOperations<PackageFolderRequest, PackageFolder> {
  packageUrl = `${environment.api}/${CARTELLA_ENDPOINTS.packages}`;
  packageFolderUrl = `${environment.api}/${CARTELLA_ENDPOINTS.packageFolders}`;
  packageMetaUrl = `${environment.api}/${CARTELLA_ENDPOINTS.packagesMeta}`;
  suggestionsUrl = EXTERNAL_ENDPOINTS.packageSuggestions;
  constructor(private http: HttpClient) {}

  createNewPackage(data: PackageRequest) {
    return this.http.post<Package>(this.packageUrl, data);
  }
  getPackages() {
    return this.http.get<PayloadResponse<Package>>(this.packageUrl);
  }

  getFavoritePackages() {
    return this.http.get<PayloadResponse<Package>>(
      `${this.packageUrl}/favorites`
    );
  }

  getPackagesInFolder(folderId: string) {
    return this.http.get<PayloadResponse<Package>>(
      `${this.packageUrl}/folder/${folderId}`
    );
  }

  updatePackage(id: string, data: Partial<PackageRequest>) {
    return this.http.put<Package>(`${this.packageUrl}/${id}`, data);
  }

  moveToFolder(id: string, folderId: string) {
    const data: Partial<PackageRequest> = {
      folderId,
    };
    return this.http.put<Package>(`${this.packageUrl}/${id}`, data);
  }

  deletePackage(id: string) {
    return this.http.delete(`${this.packageUrl}/${id}`);
  }

  getPackageSuggestions(query: string) {
    return this.http
      .get<PackageSuggestions[]>(
        `${this.suggestionsUrl}?q=${encodeURIComponent(query)}&size=10`
      )
      .pipe(
        map((data: any[]) =>
          data.map((item) => ({
            name: item.package?.name,
            description: item.package?.description,
          }))
        )
      );
  }
  getPackageDetails(packageName: string) {
    return this.http.get<PackageMetaData>(
      `${this.packageMetaUrl}/details/${encodeURIComponent(packageName)}`
    );
  }

  getPackageBundleDetails(packageName: string) {
    return this.http.get<PackageBundleMetaData>(
      `${this.packageMetaUrl}/bundle/${encodeURIComponent(packageName)}`
    );
  }

  updateViews(id: string) {
    return this.http.put(`${this.packageUrl}/views/${id}`, {});
  }

  createNewFolder(data: PackageFolderRequest) {
    return this.http.post<PackageFolder>(this.packageFolderUrl, data);
  }

  getFolders() {
    return this.http.get<PayloadResponse<PackageFolder>>(this.packageFolderUrl);
  }

  updateFolder(id: string, data: Partial<PackageFolder>) {
    return this.http.put<PackageFolder>(`${this.packageFolderUrl}/${id}`, data);
  }

  deleteFolder(id: string) {
    return this.http.delete(`${this.packageFolderUrl}/${id}`);
  }

  getPackagesInAFolder(folderId: string) {
    return this.http.get<Package[]>(`${this.packageUrl}/folder/${folderId}`);
  }
}
