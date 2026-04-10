import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import * as C from '../constants';
import type * as T from '../types';
import { PrismaService } from '../prismaService/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
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
    const users = await this.prisma.user.findMany({ select: { id: true, login: true, role: true, createdAt: true, updatedAt: true } });

    return users.map((u) => this.safeUser(u));
  }

  async findOne(id: string): Promise<T.ResponseUserType> {
    const user = await this.prisma.user
      .findUnique({ where: { id }, select: { id: true, login: true, role: true, createdAt: true, updatedAt: true } });

    this.ensureUser(user);

    return this.safeUser(user);
  }

  async create(dto: CreateUserDto): Promise<T.ResponseUserType> {
    const now = new Date();
    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        password: dto.password,
        role: dto.role || C.VIEWER,
        createdAt: now,
        updatedAt: now,
      },
      select: { id: true, login: true, role: true, createdAt: true, updatedAt: true }
    });

    return this.safeUser(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<T.ResponseUserType> {
    const user = await this.prisma.user.findUnique({ where: { id }, select: { password: true } });
    if (!user) {
      throw new NotFoundException(C.USER_NOT_FOUND);
    }

    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException();
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        password: dto.newPassword,
      },
      select: { id: true, login: true, role: true, createdAt: true, updatedAt: true }
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
