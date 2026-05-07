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
}