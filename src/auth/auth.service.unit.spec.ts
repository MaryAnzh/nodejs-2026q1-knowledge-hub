import { vi, Mocked, describe, it, beforeEach, expect } from 'vitest';
import { AuthService } from './auth.service';
import { PrismaService } from '../prismaService/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Role, User } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import * as Exc from '@nestjs/common';
import { invalidatedRefreshTokens } from './token-store';

import { createPrismaMock } from '../test-utils/createPrismaMock';
import { createJwtMock } from '../test-utils/createJwtMock';

vi.mock('bcryptjs', async () => ({
    hash: vi.fn(),
    compare: vi.fn(),
}))

describe('AuthService (unit)', () => {
    let service: AuthService;
    let prisma: ReturnType<typeof createPrismaMock>;
    let jwt: Mocked<JwtService>;
    const hashMock = hash as unknown as ReturnType<typeof vi.fn>;
    const compareMock = compare as unknown as ReturnType<typeof vi.fn>;

    const id = '1';
    const login = 'Jon';
    const password = '123456';
    const hashedPass = 'hashed-pass';
    const role = Role.viewer;
    const token = 'a.b.c';
    const accessToken = 'access-token';
    const refreshToken = 'refresh-token';
    const wrongToken = 'wrong-token';;
    const newAccess = 'new-access';
    const newRefresh = 'new-refresh';
    const dto: LoginDto = { login, password };

    beforeEach(() => {
        vi.clearAllMocks();
        prisma = createPrismaMock();
        jwt = createJwtMock();
        service = new AuthService(prisma as unknown as PrismaService, jwt);

        invalidatedRefreshTokens.clear();
    })

    // SIGNUP
    describe('signup', () => {
        it('should throw ConflictException if login already exists', async () => {
            prisma.user.findUnique.mockResolvedValue({ id });
            await expect(service.signup(dto)).rejects.toThrow(Exc.ConflictException);
        })

        it('should hash password and create user', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            hashMock.mockResolvedValue(hashedPass);

            prisma.user.create.mockResolvedValue({
                id,
                login,
                password: hashedPass,
                role,
            } as User);

            const result = await service.signup(dto);

            expect(hash).toHaveBeenCalled();
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    login: dto.login,
                    password: hashedPass,
                    role,
                },
            });
            expect(result).toEqual({ id });
        });
    })

    // LOGIN
    describe('login', () => {
        it('should throw UnauthorizedException if user not found', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            await expect(service.login(dto)).rejects.toThrow(Exc.UnauthorizedException);
        })

        it('should throw UnauthorizedException if password invalid', async () => {
            prisma.user.findUnique.mockResolvedValue({
                id,
                login,
                password: hashedPass,
            } as User);

            compareMock.mockResolvedValue(false);

            const dto: LoginDto = { login, password: 'wrong' };

            await expect(service.login(dto)).rejects.toThrow(Exc.UnauthorizedException);
        })

        it('should return tokens on valid login', async () => {
            prisma.user.findUnique.mockResolvedValue({
                id,
                login,
                password: hashedPass,
                role,
            } as User);

            compareMock.mockResolvedValue(true);

            jwt.signAsync.mockResolvedValueOnce(accessToken);
            jwt.signAsync.mockResolvedValueOnce(refreshToken);

            const result = await service.login(dto)

            expect(result).toEqual({
                accessToken,
                refreshToken,
            })
        })
    })

    // REFRESH
    describe('refresh', () => {
        it('should throw UnauthorizedException if no token provided', async () => {
            await expect(service.refresh('')).rejects.toThrow(Exc.UnauthorizedException);
        })

        it('should throw ForbiddenException if token is invalidated', async () => {
            invalidatedRefreshTokens.add(wrongToken);
            await expect(service.refresh(wrongToken)).rejects.toThrow(Exc.ForbiddenException);
        })

        it('should throw ForbiddenException if token format invalid', async () => {
            await expect(service.refresh(wrongToken)).rejects.toThrow(Exc.ForbiddenException);
        })

        it('should throw ForbiddenException if jwt.verifyAsync throws', async () => {
            jwt.verifyAsync.mockRejectedValue(new Error('bad token'));
            await expect(service.refresh(wrongToken)).rejects.toThrow(Exc.ForbiddenException);
        })

        it('should return new tokens on valid refresh', async () => {
            jwt.verifyAsync.mockResolvedValue({
                userId: id,
                login,
                role,
            });

            prisma.user.findUnique.mockResolvedValue({
                id,
                login,
                role,
            } as User);

            jwt.signAsync.mockResolvedValueOnce(newAccess);
            jwt.signAsync.mockResolvedValueOnce(newRefresh);

            const result = await service.refresh(token);

            expect(result).toEqual({
                accessToken: newAccess,
                refreshToken: newRefresh,
            });
        })

        it('should throw UnauthorizedException if user not found', async () => {
            jwt.verifyAsync.mockResolvedValue({ userId: id });
            prisma.user.findUnique.mockResolvedValue(null);

            await expect(service.refresh(token)).rejects.toThrow(Exc.UnauthorizedException);
        })
    })
})