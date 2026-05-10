import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prismaService/prisma.service';
import { ChunkService } from './chunk.service';
import { VectorStoreService } from './vector-store.service';
import { randomUUID } from 'crypto';
import { RagGeminiService } from './rag-gemini.service';
import { ReindexRequestType } from '../../types';

import * as C from '../../constants';

@Injectable()
export class RagService {
    constructor(
        private prisma: PrismaService,
        private chunker: ChunkService,
        private gemini: RagGeminiService,
        private vectorStore: VectorStoreService,
    ) { }

    async indexAllArticles({ onlyPublished = true, articleIds }: ReindexRequestType) {
        const articles = await this.prisma.article.findMany({
            where: {
                ...(onlyPublished ? { status: 'published' } : {}),
                ...(articleIds ? { id: { in: articleIds } } : {}),
            },
            include: { tags: true },
        });

        let totalChunks = 0;

        for (const article of articles) {
            await this.vectorStore.deleteByArticleId(article.id);

            const chunks = this.chunker.chunk(article.content);
            totalChunks += chunks.length;

            const records = [];

            for (const chunk of chunks) {
                const embedding = await this.gemini.embed(chunk);

                records.push({
                    id: randomUUID(),
                    articleId: article.id,
                    chunk,
                    embedding,
                    metadata: {
                        title: article.title,
                        status: article.status,
                        categoryId: article.categoryId,
                        tags: article.tags,
                    },
                });
            }

            await this.vectorStore.addMany(records);
        }

        return {
            indexedArticles: articles.length,
            indexedChunks: totalChunks,
            vectorCollection: C.ARTICLES
        };
    }

    async search(query: string) {
        const queryEmbedding = await this.gemini.embed(query);

        const results = await this.vectorStore.searchByEmbedding(queryEmbedding);

        return results.map(r => ({
            articleId: r.articleId,
            chunk: r.chunk,
            score: r.score,
            metadata: r.metadata,
        }));
    }

    async chat(query: string) {
        // 1. embedding запроса
        const queryEmbedding = await this.gemini.embed(query);

        // 2. semantic search
        const ranked = await this.vectorStore.searchByEmbedding(queryEmbedding);

        // 3.chanks
        const topChunks = ranked.slice(0, 5);

        // 4. context
        const context = topChunks
            .map(c => `Article: ${c.metadata.title}\nChunk: ${c.chunk}`)
            .join('\n\n');

        const prompt = `
You are a helpful assistant. Use ONLY the provided context.
If the answer is not in the context, say "I don't know".

Context:
${context}

User question:
${query}

Answer:
`;

        // gemini
        const answer = await this.gemini.embed(prompt);

        // 6. => answer
        return {
            answer,
            sources: topChunks.map(c => ({
                articleId: c.articleId,
                title: c.metadata.title,
                score: c.score,
            })),
        };
    }
}