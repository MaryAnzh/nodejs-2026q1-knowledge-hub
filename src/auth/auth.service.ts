import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Role, User } from '@prisma/client';

import { PrismaService } from '../prismaService/prisma.service';
import * as C from '../constants';

import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import type { TimeTokenType } from '../types';

@Injectable()
export class AuthService {
  private ACCESS_TTL = process.env.JWT_ACCESS_TTL as TimeTokenType || '15m';
  private REFRESH_TTL = process.env.JWT_REFRESH_TTL as TimeTokenType || '7d';
  private CRYPT_SALT = Number(process.env.CRYPT_SALT) ?? 10;

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) { }

  async signup(dto: SignupDto) {
    const exists = await this.prisma.user.findUnique({
      where: { login: dto.login },
    });

    if (exists) {
      throw new ConflictException(C.USER_EXISTS);
    }

    const hashed = await bcrypt.hash(dto.password, this.CRYPT_SALT);

    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        password: hashed,
        role: Role.viewer,
      },
    });

    return this.issueTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { login: dto.login },
    });

    if (!user) {
      throw new UnauthorizedException(C.WRONG_LOGIN);
    }

    const valid = await bcrypt.compare(dto.password, user.password);

    if (!valid) {
      throw new UnauthorizedException(C.WRONG_PASSWORD);
    }

    return this.issueTokens(user);
  }

  async refresh(dto: RefreshDto) {
    try {
      const payload = await this.jwt.verifyAsync(dto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        throw new UnauthorizedException(C.INVALID_REFRESH_TOKEN);
      }

      return this.issueTokens(user);
    } catch {
      throw new UnauthorizedException(C.INVALID_REFRESH_TOKEN);
    }
  }

  private async issueTokens({ id, login, role }: User) {
    const accessToken = await this.jwt.signAsync(
      { id, login, role }, {
      secret: process.env.JWT_SECRET,
      expiresIn: this.ACCESS_TTL,
    });

    const refreshToken = await this.jwt.signAsync(
      { id, login, role },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: this.REFRESH_TTL,
      },
    );

    return { accessToken, refreshToken };
  }
}
