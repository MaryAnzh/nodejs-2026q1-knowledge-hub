import { Role, User } from '@prisma/client';

export type AccessStrategyType = Pick<User, 'login' | 'role' | 'id'>;
export type TimeTokenType = `${number}${'m' | 'd'}`;
