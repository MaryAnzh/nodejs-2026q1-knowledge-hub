import { ConfigService } from "@nestjs/config";
import { Mocked, vi } from 'vitest';

export const createConfigMock = (
    overrides?: Partial<Mocked<ConfigService>>
): Mocked<ConfigService> => {
    const base: Mocked<ConfigService> = {
        get: vi.fn((key, def) => {
            if (key === 'ACCESS_TTL') return '15m';
            if (key === 'REFRESH_TTL') return '7d';
            if (key === 'JWT_SECRET') return 'test_access_secret';
            if (key === 'JWT_REFRESH_SECRET') return 'test_refresh_secret';
            if (key === 'CRYPT_SALT') return 10;
            return def;
        }),
    } as unknown as Mocked<ConfigService>

    return Object.assign(base, overrides)
}
