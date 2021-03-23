import { LoggedUser, User } from '@app/interfaces/user.interface';

export class GetLoggedInUser {
  static readonly type = '[User] Get';
}

export class SetLoggedInUser {
  static readonly type = '[User] Set';
  constructor(public payload: LoggedUser) {}
}
export class UpdateUser {
  static readonly type = '[User] Update';
  constructor(public id: string, public payload: Partial<User>) {}
}
export class UpdateUserLoginMethod {
  static readonly type = '[User] Update Login Method';
  constructor(public id: string, public payload: { [key: string]: boolean }) {}
}

export class LogoutUser {
  static readonly type = '[User] Logout';
}
