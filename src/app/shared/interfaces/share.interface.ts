import { User } from './user.interface';

export interface SharedWith {
  id: string;
  access: Access;
  user: Pick<User, 'id' | 'email' | 'image' | 'firstname' | 'lastname'>;
}

export enum Access {
  read = 'READ',
  write = 'WRITE',
  delete = 'DELETE',
}
