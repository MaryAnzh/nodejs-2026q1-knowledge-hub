import { Role } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

export interface TokenPayloadType extends JwtPayload {
  userId: string;
  login: string;
  role: Role;
}

export type TimeTokenType = `${number}${'m' | 'd'}`;
