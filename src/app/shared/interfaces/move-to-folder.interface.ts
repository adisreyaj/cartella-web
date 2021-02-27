import { Bookmark } from '@app/bookmarks/shared/interfaces/bookmarks.interface';
import { Package } from '@app/packages/shared/interfaces/packages.interface';
import { Snippet } from '@app/snippets/shared/interfaces/snippets.interface';
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
