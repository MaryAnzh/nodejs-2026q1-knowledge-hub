import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { ArticleType } from 'src/types';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ARTICLES_STATUS } from 'src/constants';
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

  findOne(id: string): ArticleType | null {
    return this.db.articles.find((a) => a.id === id) || null;
  }

  create(dto: CreateArticleDto): ArticleType {
    const now = Date.now();

    const article: ArticleType = {
      id: uuidV4(),
      title: dto.title,
      content: dto.content,
      status: dto.status ?? ARTICLES_STATUS.DRAFT,
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
