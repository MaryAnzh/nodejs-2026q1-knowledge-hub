import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChunkService {
    constructor(private config: ConfigService) { }

    chunk(text: string): string[] {
        const size = Number(this.config.get('RAG_CHUNK_SIZE', 500));
        const overlap = Number(this.config.get('RAG_CHUNK_OVERLAP', 50));

        const chunks: string[] = [];
        let start = 0;

        while (start < text.length) {
            const end = start + size;
            chunks.push(text.slice(start, end));
            start = end - overlap;
        }

        return chunks;
    }
}