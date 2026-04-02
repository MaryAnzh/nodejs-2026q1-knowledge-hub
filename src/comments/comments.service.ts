import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentType } from 'src/types';
import { InMemoryDB } from 'src/storage/in-memory.db';
import * as C from '../constants'

@Injectable()
export class CommentsService {
    constructor(private readonly db: InMemoryDB) { }

    findByArticle(articleId: string): CommentType[] {
        return this.db.comments.filter(c => c.articleId === articleId);
    }

    findOne(id: string): CommentType | null {
        return this.db.comments.find(c => c.id === id) || null;
    }

    create(dto: CreateCommentDto): CommentType {
        const article = this.db.articles.find(({ id }) => id === dto.articleId);
        if (!article) {
            throw new UnprocessableEntityException(C.ARTICLE_NOT_FOUND);
        }

        const now = Date.now();
        const comment: CommentType = {
            id: uuidV4(),
            content: dto.content,
            articleId: dto.articleId,
            authorId: dto.authorId ?? null,
            createdAt: now,
        };

        this.db.comments.push(comment);
        return comment;
    }

    remove(id: string): boolean {
        const exists = this.findOne(id);
        if (!exists) return false;

        this.db.comments = this.db.comments.filter(c => c.id !== id);
        return true;
    }

    removeByArticleId(articleId: string): void {
        this.db.comments = this.db.comments.filter(c => c.articleId !== articleId);
    }

    removeByAuthorId(authorId: string): void {
        this.db.comments = this.db.comments.filter(c => c.authorId !== authorId);
    }

}