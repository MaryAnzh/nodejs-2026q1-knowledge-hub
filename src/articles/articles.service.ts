import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import {
  ArticleSortEntities,
  ArticleSortType,
  ArticleStatusType,
  ArticleType,
} from 'src/types';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import * as C from 'src/constants';
import { InMemoryDB } from 'src/storage/in-memory.db';

@Injectable()
export class ArticlesService {
  constructor(private readonly db: InMemoryDB) {}

  findAll(filters?: {
    status?: string;
    categoryId?: string;
    tag?: string;
  }): ArticleType[] {
    let result = [...this.db.articles];

    if (filters?.status) {
      result = result.filter((a) => a.status === filters.status);
    }

    if (filters?.categoryId) {
      result = result.filter((a) => a.categoryId === filters.categoryId);
    }

    if (filters?.tag) {
      result = result.filter((a) => a.tags.includes(filters.tag));
    }

    return result;
  }

  //hacker score
  findAllWithQuery(query: {
    page?: number;
    limit?: number;
    sortBy?: keyof ArticleSortEntities;
    order?: ArticleSortType;
    status?: ArticleStatusType;
    categoryId?: string;
    tag?: string;
  }) {
    const page = query.page && query.page > 0 ? query.page : C.FIRST_PAGE_COUNT;
    const limit =
      query.limit && query.limit > 0 ? query.limit : C.ITEM_COUNT_IN_PAGE;
    const data = [
      ...this.findAll({
        status: query.status,
        categoryId: query.categoryId,
        tag: query.tag,
      }),
    ];

    if (query.sortBy) {
      const sortField = query.sortBy;
      const order = query.order === C.DESC ? -1 : 1;

      data.sort((a, b) => {
        let av: any;
        let bv: any;

        if (sortField === 'categoryId') {
          const catA = this.db.categories.find((c) => c.id === a.categoryId);
          const catB = this.db.categories.find((c) => c.id === b.categoryId);

          av = catA?.name ?? '';
          bv = catB?.name ?? '';
        } else {
          av = a[sortField];
          bv = b[sortField];
        }

        if (av < bv) return -1 * order;
        if (av > bv) return 1 * order;
        return 0;
      });
    }

    const total = data.length;

    const start = (page - 1) * limit;
    const end = start + limit;

    const paginated = data.slice(start, end);

    return {
      total,
      page,
      limit,
      data: paginated,
    };
  }

  findOne(id: string): ArticleType | null {
    return this.db.articles.find((a) => a.id === id) || null;
  }

  create(dto: CreateArticleDto): ArticleType {
    const now = Date.now();

    const article: ArticleType = {
      id: uuidV4(),
      title: dto.title,
      content: dto.content,
      status: dto.status ?? C.DRAFT,
      authorId: dto.authorId ?? null,
      categoryId: dto.categoryId ?? null,
      tags: dto.tags ?? [],
      createdAt: now,
      updatedAt: now,
    };

    this.db.articles.push(article);
    return article;
  }

  update(id: string, dto: UpdateArticleDto): ArticleType {
    const article = this.findOne(id);
    if (!article) throw new NotFoundException();

    Object.assign(article, dto);
    article.updatedAt = Date.now();

    return article;
  }

  remove(id: string): boolean {
    const exists = this.findOne(id);
    if (!exists) return false;

    this.db.articles = this.db.articles.filter((a) => a.id !== id);
    this.db.comments = this.db.comments.filter(
      ({ articleId }) => id !== articleId,
    );

    return true;
  }
}
