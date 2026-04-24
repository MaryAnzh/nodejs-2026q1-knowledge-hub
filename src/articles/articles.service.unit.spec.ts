import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ArticlesService } from './articles.service';
import { PrismaService } from '../prismaService/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import * as TEST_UTIL from '../test-utils';
import * as C from '../constants';
import { Article } from '@prisma/client';

describe('ArticlesService (unit)', () => {
    let prisma: ReturnType<typeof TEST_UTIL.createPrismaMock>;
    let service: ArticlesService;
    const expectedObj = (obj: Article & { tags: string[] }) => ({
        ...obj,
        createdAt: obj.createdAt.getTime(),
        updatedAt: obj.updatedAt.getTime(),
    });

    beforeEach(() => {
        prisma = TEST_UTIL.createPrismaMock();

        service = new ArticlesService(prisma as unknown as PrismaService);
    });

    it('should return filtered articles', async () => {
        prisma.article.findMany.mockResolvedValue(TEST_UTIL.TEST_ARTICLES);

        const result = await service.findAll({ status: C.DRAFT });

        expect(prisma.article.findMany).toHaveBeenCalledWith({
            where: {
                status: C.DRAFT,
                categoryId: undefined,
                tags: undefined,
            },
            include: { tags: true },
        });
        const expected = expectedObj(TEST_UTIL.TEST_ARTICLES[0]);

        expect(result[0]).toMatchObject(expected);
    });

    it('should return article by id', async () => {
        const testArticle = TEST_UTIL.TEST_ARTICLES[0];
        prisma.article.findUnique.mockResolvedValue(testArticle);

        const result = await service.findOne(testArticle.authorId);

        expect(result.id).toBe(testArticle.id);
    });

    it('should throw NotFoundException if article not found', async () => {
        prisma.article.findUnique.mockResolvedValue(null);

        await expect(service.findOne(TEST_UTIL.TEST_ID)).rejects.toThrow(NotFoundException);
    });

    // CREATE
    it('should create article without tags', async () => {
        const testArticle = TEST_UTIL.TEST_ARTICLES[0];
        prisma.article.create.mockResolvedValue(testArticle);

        const dto = { title: testArticle.title, content: testArticle.content };

        const result = await service.create(dto);

        expect(prisma.article.create).toHaveBeenCalled();
        expect(result.title).toBe(testArticle.title);
    });

    it('should update article', async () => {
        const testArticle = { ...TEST_UTIL.TEST_ARTICLES[0], authorId: 'user1' };
        const updated = TEST_UTIL.UPDATED;
        prisma.article.findUnique.mockResolvedValue(testArticle);

        prisma.article.update.mockResolvedValue({
            ...testArticle,
            title: updated,
            content: updated,
        });

        const dto = { title: updated, content: updated };
        const user = { userId: 'user1', role: C.EDITOR };

        const result = await service.update(testArticle.id, dto, user);

        expect(result.title).toBe(updated);
    });

    it('should throw NotFoundException on update if article not found', async () => {
        prisma.article.findUnique.mockResolvedValue(null);

        await expect(
            service.update(TEST_UTIL.TEST_ID, {}, { userId: 'x', role: C.EDITOR }),
        ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if editor updates not own article', async () => {
        const testArticle = { ...TEST_UTIL.TEST_ARTICLES[1], authorId: 'another' };
        prisma.article.findUnique.mockResolvedValue(testArticle);

        await expect(
            service.update(testArticle.id, {}, { userId: 'user1', role: C.EDITOR }),
        ).rejects.toThrow(ForbiddenException);
    });

    it('should delete article as admin', async () => {
        const testArticle = { ...TEST_UTIL.TEST_ARTICLES[0], authorId: TEST_UTIL.TEST_USER_ID };
        prisma.article.findUnique.mockResolvedValue(testArticle);

        prisma.article.delete.mockResolvedValue({});

        const user = { userId: TEST_UTIL.TEST_USER_ID_2, role: C.ADMIN };

        const result = await service.remove(testArticle.id, user);

        expect(prisma.article.delete).toHaveBeenCalled();
        expect(result).toBe(null);
    });

    it('should throw ForbiddenException if non-admin deletes not own article', async () => {
        const testArticle = { ...TEST_UTIL.TEST_ARTICLES[0], authorId: TEST_UTIL.TEST_USER_ID };
        prisma.article.findUnique.mockResolvedValue(testArticle);

        const user = { userId: TEST_UTIL.TEST_USER_ID_2, role: C.EDITOR };

        await expect(service.remove(testArticle.id, user)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException on delete if article not found', async () => {
        prisma.article.findUnique.mockResolvedValue(null);

        await expect(
            service.remove(TEST_UTIL.TEST_ID, { userId: 'x', role: C.ADMIN }),
        ).rejects.toThrow(NotFoundException);
    });
});