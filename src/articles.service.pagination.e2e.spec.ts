import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles/articles.service';
import { InMemoryDB } from 'src/storage/in-memory.db';

describe('ArticlesService — pagination & sorting', () => {
  let service: ArticlesService;
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
      providers: [ArticlesService, { provide: InMemoryDB, useValue: db }],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  // PAGINATION
  it('should paginate results', () => {
    const result = service.findAllWithQuery({ page: 1, limit: 2 });

    expect(result.total).toBe(3);
    expect(result.data.length).toBe(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(2);
  });

  it('should return empty data for page out of range', () => {
    const result = service.findAllWithQuery({ page: 10, limit: 5 });

    expect(result.data.length).toBe(0);
    expect(result.total).toBe(3);
  });

  // SORTING BY TITLE
  it('should sort by title ascending', () => {
    const result = service.findAllWithQuery({ sortBy: 'title', order: 'asc' });

    expect(result.data.map((a) => a.title)).toEqual(['A', 'B', 'C']);
  });

  it('should sort by title descending', () => {
    const result = service.findAllWithQuery({ sortBy: 'title', order: 'desc' });

    expect(result.data.map((a) => a.title)).toEqual(['C', 'B', 'A']);
  });

  // SORTING BY CATEGORY NAME
  it('should sort by category name ascending', () => {
    const result = service.findAllWithQuery({
      sortBy: 'categoryId',
      order: 'asc',
    });

    // Category names: Art, Business, Technology
    expect(result.data.map((a) => a.categoryId)).toEqual(['c2', 'c3', 'c1']);
  });

  it('should sort by category name descending', () => {
    const result = service.findAllWithQuery({
      sortBy: 'categoryId',
      order: 'desc',
    });

    expect(result.data.map((a) => a.categoryId)).toEqual(['c1', 'c3', 'c2']);
  });

  // -----------------------------
  // FILTER + SORT + PAGINATION
  // -----------------------------
  it('should combine filtering, sorting and pagination', () => {
    const result = service.findAllWithQuery({
      status: 'draft',
      sortBy: 'createdAt',
      order: 'asc',
      page: 1,
      limit: 2,
    });

    expect(result.total).toBe(3);
    expect(result.data.length).toBe(2);
    expect(result.data.map((a) => a.createdAt)).toEqual([1, 2]);
  });
});
