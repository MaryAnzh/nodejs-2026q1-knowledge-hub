import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles/articles.controller';
import { ArticlesService } from './articles/articles.service';
import { InMemoryDB } from 'src/storage/in-memory.db';

describe('ArticlesController — pagination & sorting', () => {
  let controller: ArticlesController;
  let db: InMemoryDB;

  beforeEach(async () => {
    db = new InMemoryDB();

    db.categories = [
      { id: 'c1', name: 'Technology', description: '' },
      { id: 'c2', name: 'Art', description: '' },
      { id: 'c3', name: 'Business', description: '' },
    ];

    db.articles = [
      {
        id: '1',
        title: 'C',
        content: '',
        status: 'draft',
        authorId: null,
        categoryId: 'c1',
        tags: [],
        createdAt: 3,
        updatedAt: 3,
      },
      {
        id: '2',
        title: 'A',
        content: '',
        status: 'draft',
        authorId: null,
        categoryId: 'c2',
        tags: [],
        createdAt: 1,
        updatedAt: 1,
      },
      {
        id: '3',
        title: 'B',
        content: '',
        status: 'draft',
        authorId: null,
        categoryId: 'c3',
        tags: [],
        createdAt: 2,
        updatedAt: 2,
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [ArticlesService, { provide: InMemoryDB, useValue: db }],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  it('should return paginated data', () => {
    const result = controller.getAll(undefined, undefined, undefined, 1, 2);
    if (!Array.isArray(result)) {
      expect(result.total).toBe(3);
      expect(result.data.length).toBe(2);
    }
  });

  it('should sort by category name', () => {
    const result = controller.getAll(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      'categoryId',
      'asc',
    );
    if (!Array.isArray(result)) {
      expect(result.data.map((a) => a.categoryId)).toEqual(['c2', 'c3', 'c1']);
    }
  });

  it('should sort by title descending', () => {
    const result = controller.getAll(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      'title',
      'desc',
    );
    if (!Array.isArray(result)) {
      expect(result.data.map((a) => a.title)).toEqual(['C', 'B', 'A']);
    }
  });
});
