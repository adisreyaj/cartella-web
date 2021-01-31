import {
  FolderBaseRequest,
  FolderBaseResponse,
} from '@app/interfaces/folder.interface';
import { Technology } from '@app/interfaces/technology.interface';

export interface SnippetFolderRequest extends FolderBaseRequest {}
export interface SnippetFolder extends FolderBaseResponse {}

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
  share?: any | null;
}

export interface Snippet extends SnippetRequest {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  folder: SnippetResponseFolder;
  owner: SnippetResponseOwner;
  technology: SnippetResponseTechnology;
}

export interface SnippetResponseFolder {
  id: string;
  name: string;
}
export interface SnippetResponseOwner {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
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
