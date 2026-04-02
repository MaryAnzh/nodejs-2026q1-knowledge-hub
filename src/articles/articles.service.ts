import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { ArticleType } from 'src/types';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ARTICLES_STATUS } from 'src/constants';

@Injectable()
export class ArticlesService {
    private articles: ArticleType[] = [];

    findAll(filters?: { status?: string; categoryId?: string; tag?: string }): ArticleType[] {
        let result = [...this.articles];

        if (filters?.status) {
            result = result.filter(a => a.status === filters.status);
        }

        if (filters?.categoryId) {
            result = result.filter(a => a.categoryId === filters.categoryId);
        }

        if (filters?.tag) {
            result = result.filter(a => a.tags.includes(filters.tag));
        }

        return result;
    }

    findOne(id: string): ArticleType | null {
        return this.articles.find(a => a.id === id) || null;
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

        this.articles.push(article);
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

        this.articles = this.articles.filter(a => a.id !== id);
        return true;
    }
}