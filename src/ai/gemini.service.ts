import {
    HttpException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { StatusCodes } from 'http-status-codes';

import * as C from '../constants';
import { AiCacheService } from './cache.service';
import { AppLogger } from '../logger/logger.service';
import { AIRoutesType, GeminiErrType, GeminiResponse } from '../types';
import { UsageService } from './usage.service';
import { validateAiResponse } from './validators/ai-response.validator';
import { AiObservabilityService } from './observability.service';

@Injectable()
export class GeminiService {
    private readonly apiKey: string;
    private readonly baseUrl: string;
    private readonly model: string;

    constructor(
        private readonly http?: HttpService,
        private readonly config?: ConfigService,
        private readonly cache?: AiCacheService,
        private readonly logger?: AppLogger,
        private readonly usage?: UsageService,
        private readonly observability?: AiObservabilityService,

    ) {
        this.apiKey = this.config.get<string>(C.GEMINI_API_KEY);
        this.baseUrl = this.config.get<string>(C.GEMINI_API_BASE_URL);
        this.model = this.config.get<string>(C.GEMINI_MODEL);
    }

    async healthCheck() {
        try {
            const res = await firstValueFrom(
                this.http.get(`${this.baseUrl}/v1/models?key=${this.apiKey}`)
            );

            return res.data
        } catch (error) {
            const status = (error as any).response?.status;
            if (status === 400) {
                throw new HttpException(
                    { message: 'Wrong location' },
                    StatusCodes.BAD_REQUEST,
                );
            }

            throw new HttpException(
                { message: C.GEMINI_API_REQUEST_FAILED },
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async generate(prompt: string, text: string, entity: AIRoutesType, params: any): Promise<string> {
        const start = Date.now();
        const cacheKey = this.cache.buildKey(this.model, text, entity, params);
        const cached = this.cache.get(cacheKey);
        this.logger.log(`Cache retrieval for key: ${cacheKey} took ${Date.now() - start}ms`);
        this.logger.log(`Cache ${cached ? 'hit' : 'miss'} for key: ${cacheKey}`);

        if (cached) {
            this.observability.recordCacheHit();
            return cached;
        }

        const maxRetries = 3;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const { data }: { data: GeminiResponse } = await firstValueFrom(
                    this.http.post(
                        `${this.baseUrl}/v1/models/${this.model}:generateContent`,
                        {
                            contents: [{ parts: [{ text: prompt }] }],
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'x-goog-api-key': this.apiKey,
                            },
                        }
                    )
                );
                await this.usage.increment(entity, data.usageMetadata.promptTokensDetails.at(0)?.tokenCount ?? 0);
                const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                const text = validateAiResponse(rawText);

                if (!text) {
                    throw new InternalServerErrorException(C.AI_RESP_UNAVAILABLE);
                }

                this.cache.set(cacheKey, text);
                const latency = Date.now() - start;
                this.observability.recordLatency(latency);
                this.observability.recordStatus(200);
                return text;
            } catch (error) {
                const status = (error as GeminiErrType).response?.status;
                await this.usage.increment(entity, 0);

                // retry on 503
                if (status === 503 && attempt < maxRetries) {
                    await new Promise(r => setTimeout(r, 500 * attempt));
                    continue;
                }

                this.observability.recordStatus(status);

                if (status === 503) {
                    const m = `${this.model} ${C.PLEAS_TRY_LATER}`;
                    this.observability.recordError(m);
                    throw new HttpException(
                        { message: m },
                        StatusCodes.SERVICE_UNAVAILABLE, // 503
                    );
                }

                if (status === 429) {
                    this.observability.recordError(C.RATE_LIMIT);
                    throw new HttpException(
                        { message: C.RATE_LIMIT },
                        StatusCodes.TOO_MANY_REQUESTS, // 429
                    );
                }

                if (status === 400) {
                    this.observability.recordError(C.NOT_SUPPORTED_LOCATION);
                    throw new HttpException(
                        { message: C.NOT_SUPPORTED_LOCATION },
                        StatusCodes.BAD_REQUEST,
                    );
                }

                this.observability.recordError(C.GEMINI_API_REQUEST_FAILED);
                throw new HttpException(
                    { message: C.GEMINI_API_REQUEST_FAILED },
                    StatusCodes.INTERNAL_SERVER_ERROR, // 500
                );
            }
        }
    }
}