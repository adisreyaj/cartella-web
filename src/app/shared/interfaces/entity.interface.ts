import { SharedWith } from './share.interface';

export interface EntityShare {
  share: SharedWith[];
}

export interface EntityOwner {
  owner: EntityOwnerResponse;
}

export interface EntityOwnerResponse {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface EntityFolder {
  folder: EntityFolderResponse;
}
export interface EntityFolderResponse {
  id: string;
  name: string;
}

export interface EntityGeneral {
  id: string;
  createdAt: Date;
  updatedAt: Date | string;
}
