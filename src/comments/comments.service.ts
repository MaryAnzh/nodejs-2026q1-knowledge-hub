import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prismaService/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from '@prisma/client';
import * as C from '../constants';

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

    if (!comment) throw new NotFoundException('Comment not found');
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

  async update(id: string, dto: UpdateCommentDto) {
    await this.findOne(id);

    const updated = await this.prisma.comment.update({
      where: { id },
      data: dto,
    });

    return this.safe(updated);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.comment.delete({ where: { id } });
    return null;
  }
}
