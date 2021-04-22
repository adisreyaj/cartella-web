import {
  EntityFolder,
  EntityGeneral,
  EntityOwner,
  EntityShare,
} from '@app/interfaces/entity.interface';
import {
  FolderBaseRequest,
  FolderBaseResponse,
} from '@app/interfaces/folder.interface';
import { Technology } from '@app/interfaces/technology.interface';
export type SnippetFolderRequest = FolderBaseRequest;
export type SnippetFolder = FolderBaseResponse;

export enum SnippetModes {
  explorer = 'EXPLORER',
  editor = 'EDITOR',
}
export interface SnippetBase {
  name: string;
  slug: string;
  metadata?: any;
  description: string | null;
  favorite: boolean;
  code?: string | null;
  private: boolean;
}

export interface SnippetRequest extends SnippetBase {
  technologyId: string;
  folderId: string;
}

export interface Snippet
  extends SnippetRequest,
    EntityGeneral,
    EntityShare,
    EntityOwner,
    EntityFolder {
  technology: SnippetResponseTechnology;
}
export interface SnippetResponseTechnology {
  id: string;
  name: string;
  mode: string;
  icon: string;
  color: string;
}

export interface ScreenShotDialogPayload {
  name: string;
  code: string;
  language: Technology;
  theme: string;
}

export interface SnippetItemEvent {
  type: SnippetItemEventType;
  snippet: Snippet;
}

export enum SnippetItemEventType {
  favorite,
  edit,
  delete,
  share,
  move,
}
