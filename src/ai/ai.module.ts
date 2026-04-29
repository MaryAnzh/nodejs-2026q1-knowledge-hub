import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { GeminiService } from './gemini.service';
import { RateLimitService } from './rate-limit.service';
import { RateLimitGuard } from './rate-limit.guard';
import { AiCacheService } from './cache.service';

@Module({
    imports: [ConfigModule],
    controllers: [AiController],
    providers: [
        GeminiService,
        AiCacheService,
        RateLimitService,
        RateLimitGuard
    ],
    exports: [GeminiService],
})
export class AiModule { }