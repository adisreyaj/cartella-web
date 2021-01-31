import {
  FolderBaseRequest,
  FolderBaseResponse,
} from '@app/interfaces/folder.interface';

export interface BookmarkFolderRequest extends FolderBaseRequest {}
export interface BookmarkFolder extends FolderBaseResponse {}

export interface BookmarkBase {
  name: string;
  url: string;
  image: string | null;
  description: string | null;
  private: boolean;
  metadata: any;
  site?: string;
  favicon?: string;
  favorite: boolean;
}

export interface BookmarkRequest extends BookmarkBase {
  tags?: string[];
  folderId: string;
  share?: any | null;
}

export interface Bookmark extends BookmarkBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  tags: any[];
  folder: BookmarkResponseFolder;
  owner: BookmarkResponseOwner;
}

export interface BookmarkResponseFolder {
  id: string;
  name: string;
}

export interface BookmarkResponseOwner {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface BookmarkMetaData {
  title: string;
  image: string;
  description: string;
  twitter?: string;
  icon?: string;
  site?: string;
}

export interface BookmarkCardEvent {
  type: BookmarkCardEventType;
  bookmark: Bookmark;
}

export enum BookmarkCardEventType {
  favorite,
  edit,
  delete,
  share,
}

export interface BookmarkAddModalPayload {
  folder: BookmarkFolder;
  bookmark?: Bookmark;
  allFolders?: BookmarkFolder[];
  type: ModalOperationType;
}

export interface BookmarkFolderAddModalPayload {
  folder?: BookmarkFolder;
  type: ModalOperationType;
}

export enum ModalOperationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
}
