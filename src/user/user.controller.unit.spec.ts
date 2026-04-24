import { describe, it, expect, beforeEach, vi, Mocked } from 'vitest';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { ADMIN } from '../constants';
import { TEST_DTO, TEST_ID, TEST_NEW_HASH, TEST_PASS, TEST_USER_RESPONSE } from '../test-utils';
import { ResponseUserType } from '../types';

describe('UserController (unit)', () => {
    let controller: UserController;
    let service: Mocked<UserService>;
    const now = new Date();

    const userResponse: ResponseUserType = {
        ...TEST_USER_RESPONSE,
        createdAt: now.getTime(),
        updatedAt: now.getTime(),
    };

    beforeEach(() => {
        service = {
            findAll: vi.fn(),
            findOne: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            updateRole: vi.fn(),
            remove: vi.fn(),
        } as unknown as Mocked<UserService>;

        controller = new UserController(service);
    });

    // findAll
    describe('findAll', () => {
        it('should return all users', async () => {
            service.findAll.mockResolvedValue([userResponse]);

            const result = await controller.findAll();

            expect(service.findAll).toHaveBeenCalled();
            expect(result).toEqual([userResponse]);
        });
    });

    // findOne
    describe('findOne', () => {
        it('should return a user by id', async () => {
            service.findOne.mockResolvedValue(userResponse);

            const result = await controller.findOne(TEST_ID);

            expect(service.findOne).toHaveBeenCalledWith(TEST_ID);
            expect(result).toEqual(userResponse);
        });
    });

    // create
    describe('create', () => {

        it('should create a user', async () => {
            service.create.mockResolvedValue(userResponse);

            const result = await controller.create(TEST_DTO);

            expect(service.create).toHaveBeenCalledWith(TEST_DTO);
            expect(result).toEqual(userResponse);
        });
    });

    // update
    describe('update', () => {
        const dto = { oldPassword: TEST_PASS, newPassword: TEST_NEW_HASH };
        const payload = { role: ADMIN, userId: TEST_ID };

        it('should update user password', async () => {
            service.update.mockResolvedValue(userResponse);

            const result = await controller.update(TEST_ID, dto, payload);

            expect(service.update).toHaveBeenCalledWith(TEST_ID, dto, payload);
            expect(result).toEqual(userResponse);
        });
    });

    // updateRole
    describe('updateRole', () => {
        const dto = { role: ADMIN };

        it('should update user role', async () => {
            service.updateRole.mockResolvedValue({
                ...userResponse,
                role: ADMIN,
            });

            const result = await controller.updateRole(TEST_ID, dto);

            expect(service.updateRole).toHaveBeenCalledWith(TEST_ID, dto);
            expect(result.role).toBe(ADMIN);
        });
    });

    // remove
    describe('remove', () => {
        it('should remove user', async () => {
            service.remove.mockResolvedValue(null);

            const result = await controller.remove(TEST_ID);

            expect(service.remove).toHaveBeenCalledWith(TEST_ID);
            expect(result).toBeNull();
        });
    });
});