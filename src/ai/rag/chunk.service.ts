import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { chunkText } from './utils/chunk-text';

@Injectable()
export class ChunkService {
    private readonly size: number;
    private readonly overlap: number;

    constructor(private readonly config: ConfigService) {
        this.size = Number(this.config.get('RAG_CHUNK_SIZE') ?? 300);
        this.overlap = Number(this.config.get('RAG_CHUNK_OVERLAP') ?? 50);
    }

    chunk(text: string): string[] {
        return chunkText(text, {
            size: this.size,
            overlap: this.overlap,
        });
    }
}