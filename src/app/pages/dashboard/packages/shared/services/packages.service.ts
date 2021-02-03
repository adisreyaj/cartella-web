import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CARTELLA_ENDPOINTS } from '@app/config/endpoints.config';
import { FolderOperations } from '@app/interfaces/folder.interface';
import { PayloadResponse } from '@app/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import { PackageBundleMetaData } from '../interfaces/bundle.interface';
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
  implements FolderOperations<PackageFolderRequest, PackageFolder> {
  packageUrl = `${environment.api}/${CARTELLA_ENDPOINTS.packages}`;
  packageFolderUrl = `${environment.api}/${CARTELLA_ENDPOINTS.packageFolders}`;
  packageMetaUrl = `${environment.api}/${CARTELLA_ENDPOINTS.packagesMeta}`;
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

  deletePackage(id: string) {
    return this.http.delete(`${this.packageUrl}/${id}`);
  }

  getPackageSuggestions(query: string) {
    return this.http.get<any[]>(
      `${this.packageMetaUrl}/suggestions/${encodeURIComponent(query)}`
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
