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

        // 3. берём топ-5 чанков
        const topChunks = ranked.slice(0, 5);

        // 4. формируем контекст
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

        // 5. вызываем Gemini (у тебя будет свой метод)
        const answer = await this.gemini.generate(prompt);

        // 6. возвращаем ответ + источники
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