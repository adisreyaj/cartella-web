export interface User {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  picture?: string;
}

export interface LoggedUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  accessToken: string;
}
