import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

import * as C from '../constants';
import type * as T from '../types';
import { PrismaService } from '../prismaService/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UserService {
  private CRYPT_SALT = Number(process.env.CRYPT_SALT) ?? 10;

  constructor(private prisma: PrismaService) { }

  private safeUser(u: Omit<User, 'password'>): T.ResponseUserType {
    return {
      id: u.id,
      login: u.login,
      role: u.role,
      createdAt: u.createdAt.getTime(),
      updatedAt: u.updatedAt.getTime(),
    };
  }

  private ensureUser(user: Omit<User, 'password'> | null) {
    if (!user) {
      throw new NotFoundException(C.USER_NOT_FOUND);
    }
  }

  async findAll(): Promise<T.ResponseUserType[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users.map((u) => this.safeUser(u));
  }

  async findOne(id: string): Promise<T.ResponseUserType> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        login: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.ensureUser(user);

    return this.safeUser(user);
  }

  async create(dto: CreateUserDto): Promise<T.ResponseUserType> {
    const now = new Date();
    const hashed = await bcrypt.hash(dto.password, this.CRYPT_SALT);

    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        password: hashed,
        role: C.VIEWER,
        createdAt: now,
        updatedAt: now,
      },
      select: {
        id: true,
        login: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return this.safeUser(user);
  }

  async update(id: string, dto: UpdateUserDto, { role, userId }: T.TokenPayloadType): Promise<T.ResponseUserType> {
    if (role !== C.ADMIN && userId !== id) {
      throw new ForbiddenException(C.USER_UPDATE_FORBIDDEN);
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { password: true },
    });
    if (!user) {
      throw new NotFoundException(C.USER_NOT_FOUND);
    }

    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException(C.WRONG_PASSWORD);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        password: dto.newPassword,
      },
      select: {
        id: true,
        login: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });


    return this.safeUser(updated);
  }

  async updateRole(id: string, dto: UpdateUserRoleDto) {
    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(C.USER_NOT_FOUND);

    const updated = await this.prisma.user.update({
      where: { id },
      data: { role: dto.role },
      select: {
        id: true,
        login: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return this.safeUser(updated);
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(C.USER_NOT_FOUND);
    }

    await this.prisma.user.delete({
      where: { id },
    });
    return null;
  }
}
