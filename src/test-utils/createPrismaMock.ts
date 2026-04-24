import { PrismaService } from '../prismaService/prisma.service';
import { vi } from 'vitest';

export const createPrismaMock = () => ({
    user: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
    article: {
        updateMany: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
    comment: {
        deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
})
