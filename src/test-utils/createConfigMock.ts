import { ConfigService } from '@nestjs/config';
import { Mocked, vi } from 'vitest';

export const TEST_ENV_KEYS = {
  ACCESS_TTL: 'ACCESS_TTL',
  REFRESH_TTL: 'REFRESH_TTL',
  JWT_SECRET: 'JWT_SECRET',
  JWT_REFRESH_SECRET: 'JWT_REFRESH_SECRET',
  CRYPT_SALT: 'CRYPT_SALT',
} as const;
export const {
  ACCESS_TTL,
  CRYPT_SALT,
  JWT_REFRESH_SECRET,
  JWT_SECRET,
  REFRESH_TTL,
} = TEST_ENV_KEYS;
export const TEST_KEY_VALUE = {
  [ACCESS_TTL]: '15m',
  [REFRESH_TTL]: '7d',
  [JWT_SECRET]: 'jwt_secret',
  [JWT_REFRESH_SECRET]: 'jwt_refresh_secret',
  [CRYPT_SALT]: 10,
} as const;

export const createConfigMock = (
  overrides?: Partial<Mocked<ConfigService>>,
): Mocked<ConfigService> => {
  const base: Mocked<ConfigService> = {
    get: vi.fn((key: keyof typeof TEST_KEY_VALUE) => {
      return TEST_KEY_VALUE[key] ?? '';
    }),
  } as unknown as Mocked<ConfigService>;

  return Object.assign(base, overrides);
};
