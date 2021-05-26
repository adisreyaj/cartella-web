/* eslint-disable @typescript-eslint/naming-convention */
export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  image?: string;
  loginMethods?: LoginMethods;
  github?: string;
  twitter?: string;
  website?: string;
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

export enum LoginMethods {
  CREDENTIALS = 'CREDENTIALS',
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
}
