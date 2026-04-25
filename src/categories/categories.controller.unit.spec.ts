import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import * as TEST_UTIL from '../test-utils';

describe('CategoriesController (unit)', () => {
  let controller: CategoriesController;
  let service: ReturnType<typeof createServiceMock>;
  const id = TEST_UTIL.TEST_ID;

  const createServiceMock = () => ({
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  });

  beforeEach(() => {
    service = createServiceMock();
    controller = new CategoriesController(
      service as unknown as CategoriesService,
    );
  });

  it('should return all categories', async () => {
    service.findAll.mockResolvedValue(TEST_UTIL.TEST_CATEGORIES);

    const result = await controller.getAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(result.length).toBe(2);
  });

  it('should return category by id', async () => {
    const category = TEST_UTIL.TEST_CATEGORIES[0];
    service.findOne.mockResolvedValue(category);

    const result = await controller.getById(category.id);

    expect(service.findOne).toHaveBeenCalledWith(category.id);
    expect(result.id).toBe(category.id);
  });

  it('should create category', async () => {
    const dto = { name: 'A', description: 'B' };
    service.create.mockResolvedValue(dto);

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result.description).toBe(dto.description);
  });

  it('should update category', async () => {
    const dto = { name: 'X' };
    service.update.mockResolvedValue(dto);

    const result = await controller.update(id, dto);

    expect(service.update).toHaveBeenCalledWith(id, dto);
    expect(result.name).toBe(dto.name);
  });

  it('should delete category', async () => {
    service.remove.mockResolvedValue(null);

    const result = await controller.delete(id);

    expect(service.remove).toHaveBeenCalledWith(id);
    expect(result).toBe(null);
  });
});
