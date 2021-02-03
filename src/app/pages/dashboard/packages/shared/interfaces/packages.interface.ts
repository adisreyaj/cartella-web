import {
  FolderBaseRequest,
  FolderBaseResponse,
} from '@app/interfaces/folder.interface';
import { PackageLinks, packageScore } from './package-details.interface';

export interface PackageFolderRequest extends FolderBaseRequest {}
export interface PackageFolder extends FolderBaseResponse {}

export interface PackageBase {
  name: string;
  image: string;
  description: string;
  metadata: any;
  repo: any;
  private: boolean;
  favorite: boolean;
}

export interface PackageRequest extends PackageBase {
  tags?: string[];
  folderId: string;
  share?: any | null;
}

export interface Package extends PackageBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  tags: any[];
  folder: PackageResponseFolder;
  owner: PackageResponseOwner;
}

export interface PackageResponseFolder {
  id: string;
  name: string;
}

export interface PackageResponseOwner {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface PackageMetaData {
  name: string;
  version: string;
  image: string;
  description: string;
  links: PackageLinks;
  license: string;
  github: {
    starsCount: number;
    issues: {
      total: number;
      open: number;
    };
  };
  npm: {
    downloadsCount: number;
  };
  score: packageScore;
}

export interface PackageCardEvent {
  type: PackageCardEventType;
  package: Package;
}

export enum PackageCardEventType {
  favorite,
  edit,
  delete,
  share,
}
