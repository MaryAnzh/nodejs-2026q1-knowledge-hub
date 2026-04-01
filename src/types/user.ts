import { ADMIN, EDITOR, VIEWER } from '../constants';

export type UserRoleType = typeof ADMIN | typeof EDITOR | typeof VIEWER;

export type CreateUserDto = {
  login: string;
  password: string;
  role?: UserRoleType;
};

export type UserType = CreateUserDto & {
  id: string; // uuid v4
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
};

export type UpdatePasswordDto = Partial<Pick<UserType, 'login' | 'role'>> & {
  oldPassword: string;
  newPassword: string;
};
