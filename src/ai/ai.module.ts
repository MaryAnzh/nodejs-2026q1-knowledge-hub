import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { GeminiService } from './gemini.service';
import { RateLimitService } from './rate-limit.service';
import { RateLimitGuard } from './rate-limit.guard';
import { AiCacheService } from './cache.service';
import { AppLoggerModule } from '../logger/logger.module';
import { UsageService } from './usage.service';

@Module({
  imports: [ConfigModule, AppLoggerModule, HttpModule],
  controllers: [AiController],
  providers: [
    GeminiService,
    AiCacheService,
    RateLimitService,
    RateLimitGuard,
    UsageService
  ],
  exports: [GeminiService],
})
export class AiModule { }
