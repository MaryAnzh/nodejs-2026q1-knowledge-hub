import { Role, User } from '@prisma/client';

export type CreateUserDto = {
  login: string;
  password: string;
  role?: Role;
};

export type UpdatePasswordDto = {
  oldPassword: string;
  newPassword: string;
};

export type ResponseUserType = Omit<
  User,
  'password' | 'createdAt' | 'updatedAt'
> & {
  createdAt: number;
  updatedAt: number;
};
