import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CARTELLA_ENDPOINTS } from '@app/config/endpoints.config';
import { environment } from '@app/env/environment';
import { HomeItemCounts, HomeItems } from '../interfaces/home.interface';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  bffUrl = `${environment.api}/${CARTELLA_ENDPOINTS.bff}`;
  bookmarkUrl = `${environment.api}/${CARTELLA_ENDPOINTS.bookmarks}`;
  snippetUrl = `${environment.api}/${CARTELLA_ENDPOINTS.snippets}`;
  packageUrl = `${environment.api}/${CARTELLA_ENDPOINTS.packages}`;

  constructor(private http: HttpClient) {}

  getItemsCount() {
    return this.http.get<HomeItemCounts>(`${this.bffUrl}/home/count`);
  }
  getLatestItemsInAllCategories() {
    return this.http.get<HomeItems[]>(`${this.bffUrl}/home/latest`);
  }
  getTopItemsInAllCategories() {
    return this.http.get<HomeItems[]>(`${this.bffUrl}/home/top`);
  }

  getRecentBookmarks() {
    return this.http.get(`${this.bookmarkUrl}/latest`);
  }
  getRecentSnippets() {
    return this.http.get(`${this.snippetUrl}/latest`);
  }
  getRecentPackages() {
    return this.http.get(`${this.packageUrl}/latest`);
  }
  getTopBookmarks() {
    return this.http.get(`${this.bookmarkUrl}/top`);
  }
  getTopSnippets() {
    return this.http.get(`${this.snippetUrl}/top`);
  }
  getTopPackages() {
    return this.http.get(`${this.packageUrl}/top`);
  }
}
