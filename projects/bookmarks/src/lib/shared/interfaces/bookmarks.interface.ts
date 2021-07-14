import { EntityFolder, EntityGeneral, EntityOwner, EntityShare } from '@cartella/interfaces/entity.interface';
import { FolderBaseRequest, FolderBaseResponse } from '@cartella/interfaces/folder.interface';
import { ModalOperationType } from '@cartella/interfaces/general.interface';

export type BookmarkFolderRequest = FolderBaseRequest;
export type BookmarkFolder = FolderBaseResponse;

export interface BookmarkBase {
  name: string;
  url: string;
  image: string | null;
  description?: string | null;
  private: boolean;
  metadata: any;
  site?: string;
  favicon?: string;
  favorite: boolean;
  domain: string | null | undefined;
}

export interface BookmarkRequest extends BookmarkBase {
  tags?: string[];
  folderId: string;
}

export interface Bookmark extends BookmarkBase, EntityOwner, EntityFolder, EntityShare, EntityGeneral {
  tags: any[];
}

export interface BookmarkResponseFolder {
  id: string;
  name: string;
}

export interface BookmarkMetaData {
  title: string;
  image: string | null;
  description: string | null;
  twitter?: string;
  favicon?: string;
  domain?: string | null | undefined;
  site?: string;
}

export enum BookmarkCardEventType {
  favorite,
  edit,
  delete,
  share,
  move,
}
export interface BookmarkCardEvent {
  type: BookmarkCardEventType;
  bookmark: Bookmark;
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
