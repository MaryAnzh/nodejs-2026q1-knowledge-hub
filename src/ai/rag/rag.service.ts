import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prismaService/prisma.service';
import { ChunkService } from './chunk.service';
import { VectorStoreService } from './vector-store.service';
import { randomUUID } from 'crypto';
import { RagGeminiService } from './rag-gemini.service';
import { RagChatResponse, RagSearchResponseType, ReindexRequestType } from '../../types';

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

    async search(query: string): Promise<RagSearchResponseType['results']> {
        const queryEmbedding = await this.gemini.embed(query);

        const results = await this.vectorStore.searchByEmbedding(queryEmbedding);

        return results.map(({ articleId, chunk, similarity, articleTitle }) => ({
            articleId,
            chunk,
            similarity,
            articleTitle,
        }));
    }

    async chat(question: string, conversationId?: string): Promise<RagChatResponse> {
        const queryEmbedding = await this.gemini.embed(question);

        const chunks = await this.vectorStore.searchByEmbedding(queryEmbedding);

        const topChunk = chunks[0]?.chunk ?? 'No relevant information found.';

        const convId = conversationId ?? crypto.randomUUID();

        return {
            answer: topChunk,
            sources: chunks.map(c => ({
                articleId: c.articleId,
                articleTitle: c.articleTitle,
                relevantChunk: c.chunk,
            })),
            conversationId: convId,
        };
    }

    async deleteArticleVectors(articleId: string) {
        const exists = await this.prisma.article.findUnique({ where: { id: articleId } });
        if (!exists) {
            throw new NotFoundException(`Article with id ${articleId} not found`);
        }

        await this.vectorStore.deleteByArticleId(articleId);
        return { deleted: true };
    }
}