import { PrismaService } from '../prismaService/prisma.service';
import { vi } from 'vitest';

export const createPrismaMock = () => ({
    user: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
})
