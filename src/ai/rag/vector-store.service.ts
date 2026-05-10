import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';

import { RagFilterType, SearchResultType, VectorRecordType } from '../../types';
import * as C from '../../constants';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from '../../logger/logger.service';

@Injectable()
export class VectorStoreService {
    private client?: QdrantClient;
    private collection?: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly logger?: AppLogger,

    ) {
        const url = this.configService.get('RAG_VECTOR_DB_URL');
        this.client = new QdrantClient({
            url
        });
        this.collection = this.configService.get('RAG_VECTOR_COLLECTION') ?? C.ARTICLES;
    }

    async addMany(records: VectorRecordType[]) {
        try {
            await this.client.upsert(this.collection, {
                points: records.map((r) => ({
                    id: r.id,
                    vector: r.embedding,
                    payload: {
                        articleId: r.articleId,
                        chunk: r.chunk,
                        ...r.metadata,
                    },
                })),
            });
        } catch (error) {
            this.logger?.error(error, 'Vector DB upsert failed');
            throw new ServiceUnavailableException('Vector database temporarily unavailable');
        }
    }

    async deleteByArticleId(articleId: string) {
        try {
            await this.client.delete(this.collection, {
                filter: {
                    must: [
                        {
                            key: 'articleId',
                            match: { value: articleId },
                        },
                    ],
                },
            });
        } catch (error) {
            this.logger?.error(error, 'Vector DB delete failed');
            throw new ServiceUnavailableException('Vector database temporarily unavailable');
        }
    }

    async searchByEmbedding(
        queryEmbedding: number[],
        filters?: RagFilterType
    ): Promise<SearchResultType[]> {
        try {
            const result = await this.client.search(this.collection, {
                vector: queryEmbedding,
                limit: 10,
                with_payload: true,
                filter: filters,
            });

            return result.map((p: any) => ({
                articleId: p.payload.articleId,
                articleTitle: p.payload.title,
                chunk: p.payload.chunk,
                similarity: p.score,
            }));
        } catch (error) {
            this.logger.error(error, 'Vector DB search failed');

            throw new ServiceUnavailableException(
                'Vector database temporarily unavailable'
            );
        }
    }

    //for test
    async countAll() {
        const info = await this.client.getCollection(this.collection);
        return info.points_count ?? 0;
    }

    async ensureCollection() {
        const collection = this.collection;

        try {
            await this.client.getCollection(collection);
            return;
        } catch { }

        await this.client.createCollection(collection, {
            vectors: {
                size: Number(this.configService.get("RAG_VECTOR_DIM") ?? 3072),
                distance: 'Cosine',
            },
        });
    }
}