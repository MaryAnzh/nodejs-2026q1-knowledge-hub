import { describe, it, expect, beforeEach } from 'vitest';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prismaService/prisma.service';
import * as TEST_UTIL from '../test-utils';
import { NotFoundCustomError } from '../errors';

describe('CategoriesService (unit)', () => {
  let prisma: ReturnType<typeof TEST_UTIL.createPrismaMock>;
  let service: CategoriesService;

  beforeEach(() => {
    prisma = TEST_UTIL.createPrismaMock();
    service = new CategoriesService(prisma as unknown as PrismaService);
  });

  it('should return all categories', async () => {
    prisma.category.findMany.mockResolvedValue(TEST_UTIL.TEST_CATEGORIES);

    const result = await service.findAll();

    expect(prisma.category.findMany).toHaveBeenCalled();
    expect(result.length).toBe(2);
  });

  it('should return category by id', async () => {
    const testCategory = TEST_UTIL.TEST_CATEGORIES[0];
    prisma.category.findUnique.mockResolvedValue(testCategory);

    const result = await service.findOne(testCategory.id);

    expect(result.id).toBe(testCategory.id);
  });

  it('should throw NotFoundException if category not found', async () => {
    prisma.category.findUnique.mockResolvedValue(null);

    await expect(service.findOne(TEST_UTIL.TEST_ID)).rejects.toThrow(
      NotFoundCustomError,
    );
  });

  it('should create category', async () => {
    const testCategory = TEST_UTIL.TEST_CATEGORIES[0];
    prisma.category.create.mockResolvedValue(testCategory);

    const dto = {
      name: testCategory.name,
      description: testCategory.description,
    };

    const result = await service.create(dto);

    expect(prisma.category.create).toHaveBeenCalled();
    expect(result.name).toBe(testCategory.name);
  });

  it('should update category', async () => {
    const testCategory = TEST_UTIL.TEST_CATEGORIES[0];
    const updated = TEST_UTIL.UPDATED;

    prisma.category.findUnique.mockResolvedValue(testCategory);
    prisma.category.update.mockResolvedValue({
      ...testCategory,
      name: updated,
    });

    const dto = { name: updated };

    const result = await service.update(testCategory.id, dto);

    expect(result.name).toBe(updated);
  });

  it('should throw NotFoundException on update if category not found', async () => {
    prisma.category.findUnique.mockResolvedValue(null);

    await expect(service.update(TEST_UTIL.TEST_ID, {})).rejects.toThrow(
      NotFoundCustomError,
    );
  });

  it('should remove category and reset categoryId in articles', async () => {
    const testCategory = TEST_UTIL.TEST_CATEGORIES[0];

    prisma.category.findUnique.mockResolvedValue(testCategory);
    prisma.article.updateMany.mockResolvedValue({ count: 1 });
    prisma.category.delete.mockResolvedValue({});

    const result = await service.remove(testCategory.id);

    expect(prisma.article.updateMany).toHaveBeenCalledWith({
      where: { categoryId: testCategory.id },
      data: { categoryId: null },
    });

    expect(prisma.category.delete).toHaveBeenCalledWith({
      where: { id: testCategory.id },
    });

    expect(result).toBe(null);
  });

  it('should throw NotFoundException on delete if category not found', async () => {
    prisma.category.findUnique.mockResolvedValue(null);

    await expect(service.remove(TEST_UTIL.TEST_ID)).rejects.toThrow(
      NotFoundCustomError,
    );
  });
});
