import { describe, it, expect, beforeEach } from 'vitest';
import { CommentsService } from './comments.service';
import { PrismaService } from '../prismaService/prisma.service';
import * as TEST_UTIL from '../test-utils';
import * as C from '../constants';
import {
  UnprocessableEntityException,
} from '@nestjs/common';
import { ForbiddenCustomError, NotFoundCustomError } from '../errors';

describe('CommentsService (unit)', () => {
  let prisma: ReturnType<typeof TEST_UTIL.createPrismaMock>;
  let service: CommentsService;

  const expectedObj = (obj: any) => ({
    ...obj,
    createdAt: obj.createdAt.getTime(),
  });

  beforeEach(() => {
    prisma = TEST_UTIL.createPrismaMock();
    service = new CommentsService(prisma as unknown as PrismaService);
  });

  it('should return comments by articleId', async () => {
    const { articleId } = TEST_UTIL.TEST_COMMENTS[0];
    prisma.comment.findMany.mockResolvedValue(TEST_UTIL.TEST_COMMENTS);

    const result = await service.findAll(articleId);

    expect(prisma.comment.findMany).toHaveBeenCalledWith({
      where: { articleId },
    });

    expect(result[0]).toMatchObject(expectedObj(TEST_UTIL.TEST_COMMENTS[0]));
  });

  it('should return comment by id', async () => {
    const testComment = TEST_UTIL.TEST_COMMENTS[0];
    prisma.comment.findUnique.mockResolvedValue(testComment);

    const result = await service.findOne(testComment.id);

    expect(result.id).toBe(testComment.id);
  });

  it('should throw NotFoundException if comment not found', async () => {
    prisma.comment.findUnique.mockResolvedValue(null);

    await expect(service.findOne(TEST_UTIL.TEST_ID)).rejects.toThrow(
      NotFoundCustomError,
    );
  });

  it('should create comment', async () => {
    const testComment = TEST_UTIL.TEST_COMMENTS[0];

    prisma.article.findUnique.mockResolvedValue(TEST_UTIL.TEST_ARTICLES[0]);
    prisma.comment.create.mockResolvedValue(testComment);

    const dto = {
      content: testComment.content,
      articleId: testComment.articleId,
      authorId: testComment.authorId,
    };

    const result = await service.create(dto);

    expect(prisma.comment.create).toHaveBeenCalled();
    expect(result.content).toBe(testComment.content);
  });

  it('should throw UnprocessableEntityException if article does not exist', async () => {
    prisma.article.findUnique.mockResolvedValue(null);

    const dto = {
      content: 'test',
      articleId: TEST_UTIL.TEST_ID,
      authorId: TEST_UTIL.TEST_USER_ID,
    };

    await expect(service.create(dto)).rejects.toThrow(
      UnprocessableEntityException,
    );
  });

  it('should delete comment as admin', async () => {
    const testComment = {
      ...TEST_UTIL.TEST_COMMENTS[0],
      authorId: TEST_UTIL.TEST_USER_ID,
    };
    prisma.comment.findUnique.mockResolvedValue(testComment);

    prisma.comment.delete.mockResolvedValue({});

    const user = { userId: TEST_UTIL.TEST_USER_ID_2, role: C.ADMIN };

    const result = await service.remove(testComment.id, user);

    expect(prisma.comment.delete).toHaveBeenCalled();
    expect(result).toBe(null);
  });

  it('should throw ForbiddenException if non-admin deletes not own comment', async () => {
    const testComment = {
      ...TEST_UTIL.TEST_COMMENTS[0],
      authorId: TEST_UTIL.TEST_USER_ID,
    };
    prisma.comment.findUnique.mockResolvedValue(testComment);

    const user = { userId: TEST_UTIL.TEST_USER_ID_2, role: C.EDITOR };

    await expect(service.remove(testComment.id, user)).rejects.toThrow(
      ForbiddenCustomError,
    );
  });

  it('should throw NotFoundException on delete if comment not found', async () => {
    prisma.comment.findUnique.mockResolvedValue(null);

    await expect(
      service.remove(TEST_UTIL.TEST_ID, { userId: 'x', role: C.ADMIN }),
    ).rejects.toThrow(NotFoundCustomError);
  });
});
