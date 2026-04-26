import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prismaService/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from '@prisma/client';
import * as C from '../constants';
import { TokenPayloadType } from '../types';
import { ForbiddenCustomError, NotFoundCustomError } from '../errors';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  private safe(comment: Comment) {
    return {
      ...comment,
      createdAt: comment.createdAt.getTime(),
    };
  }

  async findAll(articleId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { articleId },
    });
    return comments.map((c) => this.safe(c));
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) throw new NotFoundCustomError(C.COMMENT);
    return this.safe(comment);
  }

  async create(dto: CreateCommentDto) {
    const article = await this.prisma.article.findUnique({
      where: { id: dto.articleId },
    });

    if (!article) {
      throw new UnprocessableEntityException(C.ARTICLE_NOT_FOUND);
    }

    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        articleId: dto.articleId,
        authorId: dto.authorId ?? null,
      },
    });

    return this.safe(comment);
  }

  async update(id: string, dto: UpdateCommentDto, user: TokenPayloadType) {
    const exists = await this.prisma.comment.findUnique({ where: { id } });
    if (!exists) throw new NotFoundCustomError(C.COMMENT);

    if (user.role === C.EDITOR && exists.authorId !== user.userId) {
      throw new ForbiddenCustomError();
    }
    await this.findOne(id);

    const updated = await this.prisma.comment.update({
      where: { id },
      data: dto,
    });

    return this.safe(updated);
  }

  async remove(id: string, user: Omit<TokenPayloadType, 'login'>) {
    const exists = await this.prisma.comment.findUnique({ where: { id } });
    if (!exists) throw new NotFoundCustomError(C.COMMENT);

    if (user.role !== C.ADMIN && exists.authorId !== user.userId) {
      throw new ForbiddenCustomError(C.COMMENT_DELETE_EXCEPTION);
    }

    await this.prisma.comment.delete({ where: { id } });
    return null;
  }
}
