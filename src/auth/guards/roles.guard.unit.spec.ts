import { describe, it, expect, beforeEach, vi, Mocked } from 'vitest';
import { RolesGuard } from './roles.guard';
import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

export const createReflectorMock = (
  overrides?: Partial<Mocked<Reflector>>,
): Mocked<Reflector> => {
  const base: Mocked<Reflector> = {
    get: vi.fn(),
  } as unknown as Mocked<Reflector>;

  return Object.assign(base, overrides);
};

describe('RolesGuard (unit)', () => {
  let reflector: Mocked<Reflector>;
  let guard: RolesGuard;

  const mockContext = (user: any) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => 'handler',
    }) as any;

  beforeEach(() => {
    reflector = createReflectorMock();

    guard = new RolesGuard(reflector);
  });

  it('should allow access when no roles are required', () => {
    reflector.get = vi.fn().mockReturnValue(undefined);

    const ctx = mockContext({ role: Role.viewer });

    const result = guard.canActivate(ctx);

    expect(result).toBe(true);
  });

  it('should throw ForbiddenException when user has no role', () => {
    reflector.get = vi.fn().mockReturnValue([Role.admin]);

    const ctx = mockContext({});

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException when user role is not allowed', () => {
    reflector.get = vi.fn().mockReturnValue([Role.admin]);

    const ctx = mockContext({ role: Role.viewer });

    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('should allow access when user has required role', () => {
    reflector.get = vi.fn().mockReturnValue([Role.editor, Role.admin]);

    const ctx = mockContext({ role: Role.editor });

    const result = guard.canActivate(ctx);

    expect(result).toBe(true);
  });
});
