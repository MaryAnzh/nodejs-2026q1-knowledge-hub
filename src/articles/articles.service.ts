import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Article, Tag } from '@prisma/client';

import * as C from '../constants';
import * as T from '../types';
import { PrismaService } from '../prismaService/prisma.service';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  private safeArticle({
    createdAt,
    updatedAt,
    tags,
    ...rest
  }: Article & { tags: Tag[] }): T.ArticleType {
    return {
      ...rest,
      tags: tags.map((t) => t.name),
      createdAt: createdAt.getTime(),
      updatedAt: updatedAt.getTime(),
    };
  }

  async findAll({
    categoryId,
    status,
    tag,
  }: T.ArticleQueryType): Promise<T.ArticleType[]> {
    const where = {
      status: status ?? undefined,
      categoryId: categoryId ?? undefined,
      tags: tag ? { some: { name: tag } } : undefined,
    };

    const articles = await this.prisma.article.findMany({
      where,
      include: { tags: true },
    });

    return articles.map((a) => this.safeArticle(a));
  }

  //hacker score
  async findAllWithQuery({
    page,
    limit,
    status,
    categoryId,
    tag,
    sortBy,
    order,
  }: T.ArticleSortQueryType): Promise<T.ArticleSortResultType> {
    const qPage = page && page > 0 ? page : C.FIRST_PAGE_COUNT;
    const qLimit = limit && limit > 0 ? limit : C.ITEM_COUNT_IN_PAGE;

    const where = {
      status: status ?? undefined,
      categoryId: categoryId ?? undefined,
      tags: tag ? { some: { name: tag } } : undefined,
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.article.count({ where }),
      this.prisma.article.findMany({
        where,
        include: { tags: true },
        orderBy: sortBy ? { [sortBy]: order } : undefined,
        skip: (qPage - 1) * qLimit,
        take: qLimit,
      }),
    ]);

    return {
      total,
      page: qPage,
      limit: qLimit,
      data: data.map((a) => this.safeArticle(a)),
    };
  }

  async findOne(id: string): Promise<T.ArticleType> {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!article) throw new NotFoundException(C.ARTICLE_NOT_FOUND);

    return this.safeArticle(article);
  }

  async create(dto: CreateArticleDto): Promise<T.ArticleType> {
    const now = new Date();

    const article = await this.prisma.article.create({
      data: {
        title: dto.title,
        content: dto.content,
        status: dto.status ?? C.DRAFT,
        authorId: dto.authorId ?? null,
        categoryId: dto.categoryId ?? null,
        createdAt: now,
        updatedAt: now,
        tags: dto.tags
          ? {
              connectOrCreate: dto.tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: { tags: true },
    });
    return this.safeArticle(article);
  }

  async update(
    id: string,
    dto: UpdateArticleDto,
    user: T.TokenPayloadType,
  ): Promise<T.ArticleType> {
    const exists = await this.prisma.article.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(C.ARTICLE_NOT_FOUND);

    if (user.role === C.EDITOR && exists.authorId !== user.userId) {
      throw new ForbiddenException(C.EDIT_EXCEPTION);
    }

    const updated = await this.prisma.article.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
        tags: dto.tags
          ? {
              set: [],
              connectOrCreate: dto.tags.map((name) => ({
                where: { name },
                create: { name },
              })),
            }
          : undefined,
      },
      include: { tags: true },
    });

    return this.safeArticle(updated);
  }

  async remove(id: string, user: T.TokenPayloadType) {
    const exists = await this.prisma.article.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(C.ARTICLE_NOT_FOUND);

    if (user.role !== C.ADMIN && exists.authorId !== user.userId) {
      throw new ForbiddenException(C.ARTICLE_DELETE_EXCEPTION);
    }

    await this.prisma.article.delete({ where: { id } });
    return null;
  }
}
