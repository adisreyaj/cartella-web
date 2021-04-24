import { Bookmark } from '@cartella/bookmarks';
import { Package } from '@cartella/packages';
import { Snippet } from '@cartella/snippets';
import { Observable } from 'rxjs';
import { FolderBaseResponse } from './folder.interface';
import { FeatureType } from './general.interface';

export interface MoveToFolder<DataType = any> {
  moveToFolder(id: string, folderId: string): Observable<DataType>;
}

export interface MoveToFolderModalPayload {
  type: FeatureType;
  action: any;
  item: Bookmark | Snippet | Package;
  folders: Observable<FolderBaseResponse[]>;
}
