import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { CreateArticleDto } from './create-article.dto';
import { ArticleStatus } from '@prisma/client';

describe('CreateArticleDto (validation)', () => {
    const make = (data: Partial<CreateArticleDto>) =>
        Object.assign(new CreateArticleDto(), data);

    it('should fail when required fields are missing', async () => {
        const dto = make({});

        const errors = await validate(dto);

        expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail when status is invalid enum', async () => {
        const dto = make({
            title: 'Test',
            content: 'Content',
            status: 'INVALID' as any,
        });

        const errors = await validate(dto);

        expect(errors.length).toBeGreaterThan(0);
    });

    it('should pass with valid payload', async () => {
        const dto = make({
            title: 'Valid',
            content: 'Content',
            status: ArticleStatus.draft,
        });

        const errors = await validate(dto);

        expect(errors.length).toBe(0);
    });
});