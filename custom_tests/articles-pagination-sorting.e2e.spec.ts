import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from '../src/articles/articles.controller';
import { ArticlesService } from '../src/articles/articles.service';
import { PrismaService } from '../src/prismaService/prisma.service';
import { ArticleSortResultType } from '../src/types';

describe('ArticlesController — pagination & sorting (unit, prisma)', () => {
    let controller: ArticlesController;
    let prisma: PrismaService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ArticlesController],
            providers: [ArticlesService, PrismaService],
        }).compile();

        controller = module.get<ArticlesController>(ArticlesController);
        prisma = module.get<PrismaService>(PrismaService);

        // Чистим таблицу
        await prisma.comment.deleteMany();
        await prisma.article.deleteMany();

        // Создаём тестовые данные
        await prisma.article.createMany({
            data: [
                {
                    id: '1',
                    title: 'C',
                    content: '',
                    status: 'draft',
                    authorId: null,
                    categoryId: null,
                },
                {
                    id: '2',
                    title: 'A',
                    content: '',
                    status: 'draft',
                    authorId: null,
                    categoryId: null,
                },
                {
                    id: '3',
                    title: 'B',
                    content: '',
                    status: 'draft',
                    authorId: null,
                    categoryId: null,
                },
            ],
        });
    });

    afterAll(async () => {
        await prisma.comment.deleteMany();
        await prisma.article.deleteMany();
        await prisma.$disconnect();
    });

    it('should return paginated data', async () => {
        const result = await controller.getAll(undefined, undefined, undefined, 1, 2) as ArticleSortResultType;

        expect(result.total).toBe(3);
        expect(result.data.length).toBe(2);
        expect(result.data.map(a => a.id)).toEqual(['1', '2']);
    });

    it('should sort by title ascending', async () => {
        const result = await controller.getAll(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'title',
            'asc',
        ) as ArticleSortResultType;

        expect(result.data.map(a => a.title)).toEqual(['A', 'B', 'C']);
    });

    it('should sort by title descending', async () => {
        const result = await controller.getAll(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            'title',
            'desc',
        ) as ArticleSortResultType;

        expect(result.data.map(a => a.title)).toEqual(['C', 'B', 'A']);
    });

    it('should paginate after sorting', async () => {
        const result = await controller.getAll(
            undefined,
            undefined,
            undefined,
            2, // page
            1, // limit
            'title',
            'asc',
        ) as ArticleSortResultType;

        expect(result.total).toBe(3);
        expect(result.data.length).toBe(1);
        expect(result.data[0].title).toBe('B');
    });
});