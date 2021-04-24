import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CARTELLA_ENDPOINTS } from '@cartella/config/endpoints.config';
import { environment } from '@cartella/env/environment';
import { FolderOperations } from '@cartella/interfaces/folder.interface';
import { MoveToFolder } from '@cartella/interfaces/move-to-folder.interface';
import { PayloadResponse } from '@cartella/interfaces/response.interface';
import { Observable } from 'rxjs';
import {
  Bookmark,
  BookmarkFolder,
  BookmarkFolderRequest,
  BookmarkRequest,
} from '../interfaces/bookmarks.interface';

@Injectable({
  providedIn: 'root',
})
export class BookmarksService
  implements
    MoveToFolder<Bookmark>,
    FolderOperations<BookmarkFolderRequest, BookmarkFolder> {
  bookmarkUrl = `${environment.api}/${CARTELLA_ENDPOINTS.bookmarks}`;
  bookmarkFolderUrl = `${environment.api}/${CARTELLA_ENDPOINTS.bookmarkFolders}`;

  constructor(private http: HttpClient) {}

  createNewBookmark(data: BookmarkRequest) {
    return this.http.post<Bookmark>(this.bookmarkUrl, data);
  }
  getBookmarks() {
    return this.http.get<PayloadResponse<Bookmark>>(this.bookmarkUrl);
  }

  getFavoriteBookmarks() {
    return this.http.get<PayloadResponse<Bookmark>>(
      `${this.bookmarkUrl}/favorites`
    );
  }

  getBookmarksInFolder(folderId: string) {
    return this.http.get<PayloadResponse<Bookmark>>(
      `${this.bookmarkUrl}/folder/${folderId}`
    );
  }
  updateBookmark(id: string, data: Partial<BookmarkRequest>) {
    return this.http.put<Bookmark>(`${this.bookmarkUrl}/${id}`, data);
  }

  moveToFolder(id: string, folderId: string): Observable<Bookmark> {
    const data: Partial<BookmarkRequest> = {
      folderId,
    };
    return this.http.put<Bookmark>(`${this.bookmarkUrl}/${id}`, data);
  }

  updateViews(id: string) {
    return this.http.put(`${this.bookmarkUrl}/views/${id}`, {});
  }

  deleteBookmark(id: string) {
    return this.http.delete(`${this.bookmarkUrl}/${id}`);
  }

  createNewFolder(data: BookmarkFolderRequest) {
    return this.http.post<BookmarkFolder>(this.bookmarkFolderUrl, data);
  }

  getFolders() {
    return this.http.get<PayloadResponse<BookmarkFolder>>(
      this.bookmarkFolderUrl
    );
  }

  updateFolder(id: string, data: Partial<BookmarkFolder>) {
    return this.http.put<BookmarkFolder>(
      `${this.bookmarkFolderUrl}/${id}`,
      data
    );
  }

  deleteFolder(id: string) {
    return this.http.delete(`${this.bookmarkFolderUrl}/${id}`);
  }

  getBookmarksInAFolder(folderId: string) {
    return this.http.get<Bookmark[]>(`${this.bookmarkUrl}/folder/${folderId}`);
  }
}
