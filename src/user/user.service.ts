import { ForbiddenException, Injectable } from '@nestjs/common';

import { v4 as uuidV4 } from 'uuid';

import { VIEWER } from 'src/constants';
import type { UserType } from '../types';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { omitFields } from 'src/utils/omitFields';
import { InMemoryDB } from 'src/storage/in-memory.db';

@Injectable()
export class UserService {
  constructor(private readonly db: InMemoryDB) {}

  findAll(): UserType[] {
    return this.db.users;
  }

  findOne(id: string): UserType | null {
    return this.db.users.find((user) => user.id === id) || null;
  }

  create(dto: CreateUserDto): Omit<UserType, 'password'> {
    const now = Date.now();
    const user: UserType = {
      id: uuidV4(),
      login: dto.login,
      password: dto.password,
      role: dto.role || VIEWER,
      createdAt: now,
      updatedAt: now,
    };
    this.db.users.push(user);
    const safeUser = omitFields(user, ['password']);
    return safeUser;
  }

  update(id: string, dto: UpdateUserDto): Omit<UserType, 'password'> | null {
    const user = this.findOne(id);
    if (!user) return null;

    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException();
    }

    user.password = dto.newPassword;
    user.updatedAt = Date.now();
    const safeUser = omitFields(user, ['password']);
    return safeUser;
  }

  remove(id: string): boolean {
    const exists = this.findOne(id);
    if (!exists) return false;
    this.db.users = this.db.users.filter((u) => u.id !== id);
    this.db.comments = this.db.comments.filter(
      ({ authorId }) => authorId !== id,
    );

    for (const article of this.db.articles) {
      if (article.authorId === id) {
        article.authorId = null;
      }
    }

    return true;
  }
}
