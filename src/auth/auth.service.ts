import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Role, User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../prismaService/prisma.service';
import * as C from '../constants';

import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import type { TimeTokenType, TokenPayloadType } from '../types';
import { invalidatedRefreshTokens } from './token-store';

@Injectable()
export class AuthService {
  private ACCESS_TTL: TimeTokenType;
  private REFRESH_TTL: TimeTokenType
  private JWT_REFRESH_SECRET: string;
  private JWT_SECRET: string;
  private CRYPT_SALT: number;

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService
  ) {
    this.ACCESS_TTL = this.configService.get('ACCESS_TTL', '15m');
    this.REFRESH_TTL = this.configService.get('REFRESH_TTL', '7d');
    this.JWT_SECRET = this.configService.get('JWT_SECRET', 'jwt_secret');
    this.JWT_REFRESH_SECRET = this.configService.get('JWT_REFRESH_SECRET', 'jwt_refresh_secret');
    this.CRYPT_SALT = Number(this.configService.get<number>('CRYPT_SALT', 10));
  }

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

    return { id: user.id };
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

    return await this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    if (invalidatedRefreshTokens.has(refreshToken)) {
      throw new ForbiddenException(C.INVALID_REFRESH_TOKEN);
    }

    if (!refreshToken) {
      throw new UnauthorizedException(C.INVALID_REFRESH_TOKEN); // 401
    }

    if (refreshToken.split('.').length !== 3) {
      throw new ForbiddenException(C.INVALID_REFRESH_TOKEN); // 403
    }

    try {
      const payload: TokenPayloadType = await this.jwt.verifyAsync(
        refreshToken,
        {
          secret: this.JWT_REFRESH_SECRET,
        },
      );

      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new UnauthorizedException(C.INVALID_REFRESH_TOKEN); // 401
      }

      return this.issueTokens(user);
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new ForbiddenException(C.INVALID_REFRESH_TOKEN);
    }
  }

  private async issueTokens({ id, login, role }: User) {
    const accessToken = await this.jwt.signAsync(
      { userId: id, login, role },
      {
        secret: this.JWT_SECRET,
        expiresIn: this.ACCESS_TTL,
      },
    );

    const refreshToken = await this.jwt.signAsync(
      { userId: id, login, role },
      {
        secret: this.JWT_REFRESH_SECRET,
        expiresIn: this.REFRESH_TTL,
      },
    );

    return { accessToken, refreshToken };
  }
}
