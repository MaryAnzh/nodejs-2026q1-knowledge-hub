import { describe, it, expect, vi, Mocked, beforeEach } from 'vitest';
import { AccessGuard } from './access.guard';
import * as EXC from '@nestjs/common';
import * as C from '../../constants';
import { JwtService } from '@nestjs/jwt';
import * as TEST_UTIL from '../../test-utils';

vi.mock('@nestjs/passport', () => ({
    AuthGuard: () =>
        // empty extends
        class { },
}));

describe('AccessGuard (unit)', () => {
    const mockContext = (path: string): EXC.ExecutionContext =>
    ({
        switchToHttp: () => ({
            getRequest: () => ({
                path,
                url: path,
                headers: {},
            }),
        }),
    } as any);

    let jwt: Mocked<JwtService>;
    let guard: AccessGuard;

    beforeEach(() => {
        jwt = TEST_UTIL.createJwtMock();
        guard = new AccessGuard(jwt);
    });

    // PUBLIC ROUTES (table-driven)
    it.each(C.PUBLIC_ROUTES)(
        'should allow access to public route "%s" without checking token',
        (route) => {
            const ctx = mockContext(route);

            const result = guard.canActivate(ctx);

            expect(result).toBe(true);
            expect(jwt.verifyAsync).not.toHaveBeenCalled();
        }
    );

    // NON-PUBLIC ROUTES (table-driven)
    it.each([C.ROUTES.ARTICLE, C.ROUTES.CATEGORY, C.ROUTES.COMMENT])(
        'should call super.canActivate for non-public route "%s"',
        (route) => {
            const ctx = mockContext(route);

            // super.canActivate doesn't exist throw err
            expect(() => guard.canActivate(ctx)).toThrow();
        }
    );

    it('should return user when handleRequest receives valid user', () => {
        const user = { id: 1 };

        const result = guard.handleRequest(null, user);

        expect(result).toBe(user);
    });

    it('should throw UnauthorizedException when user is null', () => {
        expect(() => guard.handleRequest(null, null))
            .toThrow(EXC.UnauthorizedException);
    });

    it('should throw UnauthorizedException when err is present', () => {
        expect(() => guard.handleRequest(new Error(), { id: 1 }))
            .toThrow(EXC.UnauthorizedException);
    });
});