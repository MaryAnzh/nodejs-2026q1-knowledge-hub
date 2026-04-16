import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prismaService/prisma.service';
import { JwtService } from '@nestjs/jwt';

// ВАЖНО: мок именно bcryptjs
jest.mock('bcryptjs', () => ({
    __esModule: true,
    compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService — login()', () => {
    let service: AuthService;
    let prisma: PrismaService;
    let jwt: JwtService;

    beforeEach(async () => {
        const mockPrisma = {
            user: {
                findUnique: jest.fn(),
            },
        };

        const mockJwt = {
            signAsync: jest.fn().mockResolvedValue('signed-token'),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: mockPrisma },
                { provide: JwtService, useValue: mockJwt },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        prisma = module.get<PrismaService>(PrismaService);
        jwt = module.get<JwtService>(JwtService);
    });

    it('should validate user and return access + refresh tokens', async () => {
        const dto = { login: 'admin', password: 'admin' };

        prisma.user.findUnique = jest.fn().mockResolvedValue({
            id: 'user-id',
            login: 'admin',
            password: 'hashed-password',
        });

        const result = await service.login(dto);

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { login: dto.login },
        });

        expect(jwt.signAsync).toHaveBeenCalled();

        expect(result).toEqual({
            accessToken: 'signed-token',
            refreshToken: 'signed-token',
        });
    });
});