import { ForbiddenException, Injectable } from '@nestjs/common';

import { v4 as uuidV4 } from 'uuid';

import { VIEWER } from 'src/constants';
import type { UserType } from '../types';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { omitFields } from 'src/utils/omitFields';

@Injectable()
export class UserService {
    private users: UserType[] = [];

    findAll(): UserType[] {
        return this.users;
    }

    findOne(id: string): UserType | null {
        return this.users.find((user) => user.id === id) || null;
    }

    create(dto: CreateUserDto): Omit<UserType, 'password'> {
        const now = Date.now();
        const user: UserType = {
            id: uuidV4(),
            login: dto.login,
            password: dto.password,
            role: VIEWER,
            createdAt: now,
            updatedAt: now,
        };
        this.users.push(user);
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
        const user = this.findOne(id);
        if (!user) {
            return false;
        }

        this.users = this.users.filter((u) => u.id !== id);
        return true;
    }
}
