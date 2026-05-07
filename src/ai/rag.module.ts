import { Module } from '@nestjs/common';
import { RagController } from './rag.controller';
import { RagService } from './services/rag.service';
import { ChunkService } from './services/chunk.service';
import { VectorStoreService } from './services/vector-store.service';
import { ConfigModule } from '@nestjs/config';
import { RagGeminiService } from './services/rag-gemini.service';

@Module({
    imports: [ConfigModule],
    controllers: [RagController],
    providers: [RagService, ChunkService, RagGeminiService, VectorStoreService],
})
export class RagModule { }