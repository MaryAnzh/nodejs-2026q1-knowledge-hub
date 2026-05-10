import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RagController } from './rag.controller';
import { RagService } from './rag.service';
import { ChunkService } from './chunk.service';
import { VectorStoreService } from './vector-store.service';
import { RagGeminiService } from './rag-gemini.service';
import { AiModule } from '../ai.module';
import { AppLoggerModule } from '../../logger/logger.module';

@Module({
    imports: [ConfigModule, AiModule, AppLoggerModule],
    controllers: [RagController],
    providers: [RagService, ChunkService, RagGeminiService, VectorStoreService],
})
export class RagModule {
    constructor(private readonly vectorStore: VectorStoreService) { }

    async onModuleInit() {
        await this.vectorStore.ensureCollection();
    }
}