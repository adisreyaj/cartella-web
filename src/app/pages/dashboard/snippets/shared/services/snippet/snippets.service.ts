import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CARTELLA_ENDPOINTS } from '@app/config/endpoints.config';
import { FolderOperations } from '@app/interfaces/folder.interface';
import { PayloadResponse } from '@app/interfaces/response.interface';
import { environment } from 'src/environments/environment';
import {
  Snippet,
  SnippetFolder,
  SnippetFolderRequest,
  SnippetRequest,
} from '../../interfaces/snippets.interface';

@Injectable({
  providedIn: 'root',
})
export class SnippetsService
  implements FolderOperations<SnippetFolderRequest, SnippetFolder> {
  snippetUrl = `${environment.api}/${CARTELLA_ENDPOINTS.snippets}`;
  snippetFolderUrl = `${environment.api}/${CARTELLA_ENDPOINTS.snippetFolders}`;

  constructor(private http: HttpClient) {}

  createNewSnippet(data: SnippetRequest) {
    return this.http.post<Snippet>(this.snippetUrl, data);
  }
  getSnippets() {
    return this.http.get<PayloadResponse<Snippet>>(this.snippetUrl);
  }

  getFavoriteSnippets() {
    return this.http.get<PayloadResponse<Snippet>>(
      `${this.snippetUrl}/favorites`
    );
  }

  getSnippetsInFolder(folderId: string) {
    return this.http.get<PayloadResponse<Snippet>>(
      `${this.snippetUrl}/folder/${folderId}`
    );
  }
  updateSnippet(id: string, data: Partial<SnippetRequest>) {
    return this.http.put<Snippet>(`${this.snippetUrl}/${id}`, data);
  }

  deleteSnippet(id: string) {
    return this.http.delete(`${this.snippetUrl}/${id}`);
  }

  updateViews(id: string) {
    return this.http.put(`${this.snippetUrl}/views/${id}`, {});
  }

  createNewFolder(data: SnippetFolderRequest) {
    return this.http.post<SnippetFolder>(this.snippetFolderUrl, data);
  }

  getFolders() {
    return this.http.get<PayloadResponse<SnippetFolder>>(this.snippetFolderUrl);
  }

  updateFolder(id: string, data: Partial<SnippetFolder>) {
    return this.http.put<SnippetFolder>(`${this.snippetFolderUrl}/${id}`, data);
  }

  deleteFolder(id: string) {
    return this.http.delete(`${this.snippetFolderUrl}/${id}`);
  }

  getSnippetsInAFolder(folderId: string) {
    return this.http.get<Snippet[]>(`${this.snippetUrl}/folder/${folderId}`);
  }

  updateSnippetAndFolderBasedOnSlug(slug: string) {}
}
