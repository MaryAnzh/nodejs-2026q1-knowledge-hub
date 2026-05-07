import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prismaService/prisma.service';
import { ChunkService } from './chunk.service';
import { VectorStoreService } from './vector-store.service';
import { randomUUID } from 'crypto';
import { RagGeminiService } from './rag-gemini.service';

@Injectable()
export class RagService {
    constructor(
        private prisma: PrismaService,
        private chunker: ChunkService,
        private gemini: RagGeminiService,
        private vectorStore: VectorStoreService,
    ) { }

    async indexAllArticles() {
        const articles = await this.prisma.article.findMany({
            include: {
                tags: true,
            },
        })
        for (const { id, title, status, tags, categoryId, content } of articles) {
            await this.vectorStore.deleteByArticleId(id);

            const chunks = this.chunker.chunk(content);

            const records = [];
            for (const chunk of chunks) {
                const embedding = await this.gemini.embed(chunk);

                records.push({
                    id: randomUUID(),
                    articleId: id,
                    chunk,
                    embedding,
                    metadata: {
                        title,
                        status,
                        categoryId,
                        tags,
                    },
                });
            }

            await this.vectorStore.addMany(records);
        }

        return { indexed: true };
    }
}