import { vi, describe, it, beforeEach, expect } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { invalidatedRefreshTokens } from './token-store';

describe('AuthController (unit)', () => {
  let controller: AuthController;
  let service: ReturnType<typeof createServiceMock>;

  const createServiceMock = () => ({
    signup: vi.fn(),
    login: vi.fn(),
    refresh: vi.fn(),
  });

  beforeEach(() => {
    service = createServiceMock();
    controller = new AuthController(service as unknown as AuthService);
    invalidatedRefreshTokens.clear();
  });

  // SIGNUP
  it('signup should call service.signup with dto', async () => {
    const dto: SignupDto = { login: 'a', password: 'b' };
    service.signup.mockResolvedValue({ id: '1' });

    const result = await controller.signup(dto);

    expect(service.signup).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: '1' });
  });

  // LOGIN
  it('login should call service.login with dto', async () => {
    const dto: LoginDto = { login: 'a', password: 'b' };
    service.login.mockResolvedValue({ accessToken: 'x', refreshToken: 'y' });

    const result = await controller.login(dto);

    expect(service.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ accessToken: 'x', refreshToken: 'y' });
  });

  // REFRESH
  it('refresh should call service.refresh with token', async () => {
    service.refresh.mockResolvedValue({
      accessToken: 'new',
      refreshToken: 'new2',
    });

    const result = await controller.refresh('token123');

    expect(service.refresh).toHaveBeenCalledWith('token123');
    expect(result).toEqual({ accessToken: 'new', refreshToken: 'new2' });
  });

  // LOGOUT
  it('logout should throw if no token', async () => {
    await expect(controller.logout('')).rejects.toThrow(UnauthorizedException);
  });

  it('logout should add token to invalidatedRefreshTokens', async () => {
    const token = 'abc';
    const result = await controller.logout(token);

    expect(invalidatedRefreshTokens.has(token)).toBe(true);
    expect(result).toEqual({ message: 'Logged out successfully' });
  });
});
