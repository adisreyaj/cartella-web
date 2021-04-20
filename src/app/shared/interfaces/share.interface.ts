import { User } from './user.interface';

export interface ShareTo {
  email: string;
  access: Access;
}
export interface SharedWith extends ShareTo {
  user: Pick<User, 'id' | 'email' | 'image' | 'firstname' | 'lastname'>;
}

export enum Access {
  read = 'READ',
  write = 'WRITE',
  delete = 'DELETE',
}
