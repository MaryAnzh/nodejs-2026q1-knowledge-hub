import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import * as TEST_UTIL from '../test-utils';
import * as C from '../constants';

describe('ArticlesController (unit)', () => {
    let controller: ArticlesController;
    let service: ReturnType<typeof createServiceMock>;

    const createServiceMock = () => ({
        findAll: vi.fn(),
        findAllWithQuery: vi.fn(),
        findOne: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
    });

    beforeEach(() => {
        service = createServiceMock();
        controller = new ArticlesController(service as unknown as ArticlesService);
    });

    it('should call findAll when no pagination/sort provided', async () => {
        service.findAll.mockResolvedValue(TEST_UTIL.TEST_ARTICLES);

        const result = await controller.getAll(undefined, undefined, undefined);

        expect(service.findAll).toHaveBeenCalledWith({
            status: undefined,
            categoryId: undefined,
            tag: undefined,
        });

        expect(result).toBe(TEST_UTIL.TEST_ARTICLES);
    });

    it('should call findAllWithQuery when page/limit provided', async () => {
        service.findAllWithQuery.mockResolvedValue(TEST_UTIL.TEST_ARTICLES);

        const result = await controller.getAll(
            undefined,
            undefined,
            undefined,
            1,
            10,
            undefined,
            undefined,
        );

        expect(service.findAllWithQuery).toHaveBeenCalled();
        expect(result).toBe(TEST_UTIL.TEST_ARTICLES);
    });

    it('should return article by id', async () => {
        const article = TEST_UTIL.TEST_ARTICLES[0];
        service.findOne.mockResolvedValue(article);

        const result = await controller.getById(article.id);

        expect(service.findOne).toHaveBeenCalledWith(article.id);
        expect(result).toBe(article);
    });

    it('should create article', async () => {
        const dto = { title: 'A', content: 'B' };
        service.create.mockResolvedValue(dto);

        const result = await controller.create(dto);

        expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should update article', async () => {
        const dto = { title: 'X' };
        const user = { userId: 'u1', role: C.EDITOR };

        service.update.mockResolvedValue(dto);

        const result = await controller.update('id1', dto, user);

        expect(service.update).toHaveBeenCalledWith('id1', dto, user);
        expect(result).toBe(dto);
    });

    it('should delete article', async () => {
        const userId = TEST_UTIL.TEST_USER_ID;
        const user = { userId, role: C.ADMIN };
        service.remove.mockResolvedValue(null);

        const result = await controller.delete(TEST_UTIL.TEST_ID, user);

        expect(service.remove).toHaveBeenCalledWith(TEST_UTIL.TEST_ID, user);
        expect(result).toBe(null);
    });
});