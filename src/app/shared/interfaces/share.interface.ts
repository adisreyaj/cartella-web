import { User } from './user.interface';

export interface ShareTo {
  email: string;
  access: Access;
}

export interface UpdateSharePrefRequest {
  id: string;
  access: Access;
}
export interface SharedWith extends ShareTo {
  id: string;
  user: Pick<User, 'id' | 'email' | 'image' | 'firstname' | 'lastname'>;
}

export interface ShareRevokeRequest {
  email: string;
  id: string;
}

export enum Access {
  read = 'READ',
  write = 'WRITE',
  delete = 'DELETE',
}
