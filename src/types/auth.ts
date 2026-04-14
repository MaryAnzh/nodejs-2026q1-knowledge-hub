import { Role } from '@prisma/client';

export type AccessStrategyType = {
  userId: string;
  login: string;
  role: Role;
};
