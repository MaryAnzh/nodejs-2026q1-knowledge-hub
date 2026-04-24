import { describe, it, expect } from 'vitest';
import { userFactory } from './user.decorator';

describe('User decorator (unit)', () => {
    it('should extract user from request', () => {
        const mockUser = { id: 'user_1', role: 'admin' };

        const ctx = {
            switchToHttp: () => ({
                getRequest: () => ({ user: mockUser }),
            }),
        };

        const result = userFactory(null, ctx as any);

        expect(result).toEqual(mockUser);
    });
});