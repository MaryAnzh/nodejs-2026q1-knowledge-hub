import { vi, describe, it, beforeEach, expect, Mocked } from 'vitest';
import { UserService } from './user.service';
import { PrismaService } from '../prismaService/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import {
  createPrismaMock,
  createConfigMock,
  TEST_KEY_VALUE,
  CRYPT_SALT,
} from '../test-utils';
import { VIEWER, ADMIN } from '../constants';

vi.mock('bcryptjs', () => ({
  genSalt: vi.fn(),
  hash: vi.fn(),
  compare: vi.fn(),
}));

describe('UserService (unit)', () => {
  let service: UserService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let config: Mocked<ConfigService>;

  const genSaltMock = bcrypt.genSalt as unknown as ReturnType<typeof vi.fn>;
  const hashMock = bcrypt.hash as unknown as ReturnType<typeof vi.fn>;
  const compareMock = bcrypt.compare as unknown as ReturnType<typeof vi.fn>;

  const id = '1';
  const id2 = '2';
  const login = 'Jon';
  const password = '123456';
  const hashed = 'hashed-pass';
  const now = new Date();
  const salt = 'salt';
  const oldPassword = 'old';
  const newPassword = 'new';
  const dto = { login, password };

  beforeEach(() => {
    vi.clearAllMocks();
    prisma = createPrismaMock();
    config = createConfigMock();

    service = new UserService(prisma as unknown as PrismaService, config);
  });

  // findAll
  describe('findAll', () => {
    it('should return mapped users', async () => {
      prisma.user.findMany.mockResolvedValue([
        {
          id,
          login,
          role: Role.viewer,
          createdAt: now,
          updatedAt: now,
        },
      ]);

      const result = await service.findAll();

      expect(result).toEqual([
        {
          id,
          login,
          role: Role.viewer,
          createdAt: now.getTime(),
          updatedAt: now.getTime(),
        },
      ]);
    });
  });

  // findOne
  describe('findOne', () => {
    it('should throw if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });

    it('should return mapped user', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id,
        login,
        role: Role.viewer,
        createdAt: now,
        updatedAt: now,
      });

      const result = await service.findOne(id);

      expect(result).toEqual({
        id,
        login,
        role: Role.viewer,
        createdAt: now.getTime(),
        updatedAt: now.getTime(),
      });
    });
  });

  // create
  describe('create', () => {
    it('should hash password and create user', async () => {
      genSaltMock.mockResolvedValue(salt);
      hashMock.mockResolvedValue(hashed);

      prisma.user.create.mockResolvedValue({
        id,
        login,
        role: VIEWER,
        createdAt: now,
        updatedAt: now,
      });

      const result = await service.create(dto);

      expect(genSaltMock).toHaveBeenCalledWith(TEST_KEY_VALUE[CRYPT_SALT]);
      expect(hashMock).toHaveBeenCalledWith(password, salt);

      expect(result).toEqual({
        id,
        login,
        role: VIEWER,
        createdAt: now.getTime(),
        updatedAt: now.getTime(),
      });
    });
  });

  // update
  describe('update', () => {
    const dto = {
      oldPassword,
      newPassword,
    };

    it('should throw Forbidden if no rights', async () => {
      await expect(
        service.update(id, dto, { role: VIEWER, userId: id2 }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFound if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.update(id, dto, { role: ADMIN, userId: id2 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw Forbidden if password mismatch', async () => {
      prisma.user.findUnique.mockResolvedValue({ password: hashed });
      compareMock.mockResolvedValue(false);

      await expect(
        service.update(id, dto, { role: ADMIN, userId: id2 }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should update password', async () => {
      prisma.user.findUnique.mockResolvedValue({ password: hashed });
      compareMock.mockResolvedValue(true);

      genSaltMock.mockResolvedValue(salt);
      hashMock.mockResolvedValue('new-hash');

      prisma.user.update.mockResolvedValue({
        id,
        login,
        role: VIEWER,
        createdAt: now,
        updatedAt: now,
      });

      const result = await service.update(id, dto, {
        role: ADMIN,
        userId: id2,
      });

      expect(compareMock).toHaveBeenCalledWith(oldPassword, hashed);
      expect(hashMock).toHaveBeenCalledWith(newPassword, salt);

      expect(result).toEqual({
        id,
        login,
        role: VIEWER,
        createdAt: now.getTime(),
        updatedAt: now.getTime(),
      });
    });
  });

  // updateRole
  describe('updateRole', () => {
    it('should throw if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.updateRole(id, { role: ADMIN })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update role', async () => {
      prisma.user.findUnique.mockResolvedValue({ id });

      prisma.user.update.mockResolvedValue({
        id,
        login,
        role: ADMIN,
        createdAt: now,
        updatedAt: now,
      });

      const result = await service.updateRole(id, { role: ADMIN });

      expect(result.role).toBe(ADMIN);
    });
  });

  // remove
  describe('remove', () => {
    it('should throw if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(NotFoundException);
    });

    it('should run transaction and return null', async () => {
      prisma.user.findUnique.mockResolvedValue({ id });

      prisma.$transaction.mockResolvedValue(null);

      const result = await service.remove(id);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
