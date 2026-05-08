import { Injectable } from '@nestjs/common';
import { VectorRecordType } from '../../types';

@Injectable()
export class VectorStoreService {
    private store: VectorRecordType[] = [];

    async addMany(records: VectorRecordType[]) {
        this.store.push(...records);
    }

    async deleteByArticleId(articleId: string) {
        this.store = this.store.filter(r => r.articleId !== articleId);
    }

    async getAll() {
        return this.store;
    }

    async searchByEmbedding(queryEmbedding: number[]) {
        const cosine = (a: number[], b: number[]) => {
            const dot = a.reduce((s, v, i) => s + v * b[i], 0);
            const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
            const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
            return dot / (magA * magB);
        };

        return this.store
            .map(r => ({
                ...r,
                score: cosine(queryEmbedding, r.embedding),
            }))
            .sort((a, b) => b.score - a.score);
    }
}