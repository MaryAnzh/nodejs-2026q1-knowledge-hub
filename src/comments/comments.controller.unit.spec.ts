import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import * as TEST_UTIL from '../test-utils';
import * as C from '../constants';

describe('CommentsController (unit)', () => {
  let controller: CommentsController;
  let service: ReturnType<typeof createServiceMock>;

  const createServiceMock = () => ({
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
  });

  beforeEach(() => {
    service = createServiceMock();
    controller = new CommentsController(service as unknown as CommentsService);
  });

  it('should return empty array when no articleId provided', async () => {
    const result = await controller.getAll(undefined);

    expect(result).toEqual([]);
  });

  it('should return comments by articleId', async () => {
    const { articleId } = TEST_UTIL.TEST_COMMENTS[0];
    service.findAll.mockResolvedValue(TEST_UTIL.TEST_COMMENTS);

    const result = await controller.getAll(articleId);

    expect(service.findAll).toHaveBeenCalledWith(articleId);
    expect(result.length).toBe(1);
  });

  it('should return comment by id', async () => {
    const comment = TEST_UTIL.TEST_COMMENTS[0];
    service.findOne.mockResolvedValue(comment);

    const result = await controller.getById(comment.id);

    expect(service.findOne).toHaveBeenCalledWith(comment.id);
    expect(result.id).toBe(comment.id);
  });

  it('should create comment', async () => {
    const dto = {
      content: 'A',
      articleId: TEST_UTIL.TEST_ID_2,
      title: 'T',
      authorId: TEST_UTIL.TEST_ID,
    };
    service.create.mockResolvedValue(dto);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result.articleId).toBe(dto.articleId);
  });

  it('should delete comment', async () => {
    const user = { userId: TEST_UTIL.TEST_USER_ID, role: C.ADMIN };
    service.remove.mockResolvedValue(null);

    const result = await controller.delete(TEST_UTIL.TEST_ID, user);

    expect(service.remove).toHaveBeenCalledWith(TEST_UTIL.TEST_ID, user);
    expect(result).toBe(null);
  });
});
