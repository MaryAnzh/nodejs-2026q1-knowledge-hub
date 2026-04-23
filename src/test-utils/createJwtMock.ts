import { JwtService } from '@nestjs/jwt';
import { Mocked, vi } from 'vitest';

export const createJwtMock = (
    overrides?: Partial<Mocked<JwtService>>
): Mocked<JwtService> => {
    const base: Mocked<JwtService> = {
        signAsync: vi.fn(),
        verifyAsync: vi.fn(),
    } as unknown as Mocked<JwtService>

    return Object.assign(base, overrides)
}
