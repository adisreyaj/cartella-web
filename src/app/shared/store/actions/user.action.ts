import { LoggedUser } from '@app/interfaces/user.interface';

export class GetLoggedInUser {
  static readonly type = '[User] Get';
}

export class SetLoggedInUser {
  static readonly type = '[User] Set';
  constructor(public payload: LoggedUser) {}
}

export class LogoutUser {
  static readonly type = '[User] Logout';
}
