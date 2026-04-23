import { vi, Mocked, describe, it, beforeEach, expect } from 'vitest';
import { AuthService } from './auth.service';
import { PrismaService } from '../prismaService/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Role, User } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import * as Exc from '@nestjs/common';
import { invalidatedRefreshTokens } from './token-store';

import { createPrismaMock, createJwtMock, createConfigMock, ACCESS_TTL, TEST_KEY_VALUE, REFRESH_TTL, JWT_SECRET, JWT_REFRESH_SECRET, CRYPT_SALT } from '../test-utils';
import { ConfigService } from '@nestjs/config';

vi.mock('bcryptjs', async () => ({
    hash: vi.fn(),
    compare: vi.fn(),
}));

describe('AuthService (unit)', () => {
    let service: AuthService;
    let prisma: ReturnType<typeof createPrismaMock>;
    let jwt: Mocked<JwtService>;
    let configService: Mocked<ConfigService>;

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
    const wrongToken = 'wrong-token';
    const newAccess = 'new-access';
    const newRefresh = 'new-refresh';
    const dto: LoginDto = { login, password };

    beforeEach(() => {
        vi.clearAllMocks();
        prisma = createPrismaMock();
        jwt = createJwtMock();
        configService = createConfigMock();

        service = new AuthService(
            prisma as unknown as PrismaService,
            jwt,
            configService
        );

        invalidatedRefreshTokens.clear();
    });

    // SIGNUP
    describe('signup', () => {
        it('should throw ConflictException if login already exists', async () => {
            prisma.user.findUnique.mockResolvedValue({ id });
            await expect(service.signup(dto)).rejects.toThrow(Exc.ConflictException);
        });

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

            expect(hash).toHaveBeenCalledWith(dto.password, 10);
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    login: dto.login,
                    password: hashedPass,
                    role,
                },
            });
            expect(result).toEqual({ id });
        });
    });

    // LOGIN
    describe('login', () => {
        it('should throw UnauthorizedException if user not found', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            await expect(service.login(dto)).rejects.toThrow(Exc.UnauthorizedException);
        });

        it('should throw UnauthorizedException if password invalid', async () => {
            prisma.user.findUnique.mockResolvedValue({
                id,
                login,
                password: hashedPass,
            } as User);

            compareMock.mockResolvedValue(false);

            const wrongDto: LoginDto = { login, password: 'wrong' };

            await expect(service.login(wrongDto)).rejects.toThrow(Exc.UnauthorizedException);
        });

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

            const result = await service.login(dto);

            expect(compare).toHaveBeenCalledWith(dto.password, hashedPass);
            expect(result).toEqual({
                accessToken,
                refreshToken,
            });
        });
    });

    // REFRESH
    describe('refresh', () => {
        it('should throw UnauthorizedException if no token provided', async () => {
            await expect(service.refresh('')).rejects.toThrow(Exc.UnauthorizedException);
        });

        it('should throw ForbiddenException if token is invalidated', async () => {
            invalidatedRefreshTokens.add(wrongToken);
            await expect(service.refresh(wrongToken)).rejects.toThrow(Exc.ForbiddenException);
        });

        it('should throw ForbiddenException if token format invalid', async () => {
            await expect(service.refresh(wrongToken)).rejects.toThrow(Exc.ForbiddenException);
        });

        it('should throw ForbiddenException if jwt.verifyAsync throws', async () => {
            jwt.verifyAsync.mockRejectedValue(new Error('bad token'));
            await expect(service.refresh(wrongToken)).rejects.toThrow(Exc.ForbiddenException);
        });

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

            expect(jwt.verifyAsync).toHaveBeenCalledWith(token, {
                secret: TEST_KEY_VALUE[JWT_REFRESH_SECRET],
            });

            expect(result).toEqual({
                accessToken: newAccess,
                refreshToken: newRefresh,
            });
        });

        it('should throw UnauthorizedException if user not found', async () => {
            jwt.verifyAsync.mockResolvedValue({ userId: id });
            prisma.user.findUnique.mockResolvedValue(null);

            await expect(service.refresh(token)).rejects.toThrow(Exc.UnauthorizedException);
        });
    });

    // issueTokens (private) — тестируем через вызов
    describe('issueTokens', () => {
        it('should sign tokens with correct payload and secrets', async () => {
            const user = { id, login, role } as User;

            jwt.signAsync.mockResolvedValueOnce(accessToken);
            jwt.signAsync.mockResolvedValueOnce(refreshToken);

            const result = await (service as any).issueTokens(user);

            expect(jwt.signAsync).toHaveBeenNthCalledWith(
                1,
                { userId: id, login, role },
                {
                    secret: TEST_KEY_VALUE[JWT_SECRET],        // "jwt_secret"
                    expiresIn: TEST_KEY_VALUE[ACCESS_TTL],     // "15m"
                }
            );

            expect(jwt.signAsync).toHaveBeenNthCalledWith(
                2,
                { userId: id, login, role },
                {
                    secret: TEST_KEY_VALUE[JWT_REFRESH_SECRET], // "jwt_refresh_secret"
                    expiresIn: TEST_KEY_VALUE[REFRESH_TTL],     // "7d"
                }
            );

            expect(result).toEqual({ accessToken, refreshToken });
        });
    });

    // constructor, check ConfigService call
    describe('constructor', () => {
        it('should read all config values', () => {
            expect(configService.get).toHaveBeenCalledWith(ACCESS_TTL, TEST_KEY_VALUE[ACCESS_TTL]);
            expect(configService.get).toHaveBeenCalledWith(REFRESH_TTL, TEST_KEY_VALUE[REFRESH_TTL]);
            expect(configService.get).toHaveBeenCalledWith(JWT_SECRET, TEST_KEY_VALUE[JWT_SECRET]);
            expect(configService.get).toHaveBeenCalledWith(JWT_REFRESH_SECRET, TEST_KEY_VALUE[JWT_REFRESH_SECRET]);
            expect(configService.get).toHaveBeenCalledWith(CRYPT_SALT, TEST_KEY_VALUE[CRYPT_SALT]);
        });
    });
});