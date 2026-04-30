import { HttpException, Injectable, InternalServerErrorException, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import * as C from '../constants';
import { GeminiResponse, GeminiErrType, GeminiGenerateReturnType } from '../types';

import { AiCacheService } from './cache.service';
import { AppLogger } from '../logger/logger.service';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class GeminiService {
    private axiosClient: any;
    private readonly apiKey: string;
    private readonly baseUrl: string;
    private readonly model: string;
    private formatGeminiError(error: GeminiErrType) {
        const unknown = 'unknown';
        const { status, code, message, details } =
            error.response?.data || {
                status: unknown,
                code: 0,
                message: 'no message',
                details: [],
            };

        return `
❌ Gemini API Error
-------------------------
HTTP Status: ${status}
Error Code: ${code ?? unknown}
Message: ${message}
Details: ${details.length > 0 ? JSON.stringify(details, null, 2) : 'none'}
-------------------------
Request URL: ${error.config?.url}
Model: ${error.config?.url?.split('/models/')[1]}
    `;
    }

    constructor(
        private readonly config: ConfigService,
        private readonly cache: AiCacheService,
        private readonly logger?: AppLogger
    ) {
        this.apiKey = this.config.get<string>(C.GEMINI_API_KEY);
        this.baseUrl = this.config.get<string>(C.GEMINI_API_BASE_URL);
        this.model = this.config.get<string>(C.GEMINI_MODEL);
        this.axiosClient = axios.create({
            baseURL: this.baseUrl,
            proxy: {
                host: 'host.docker.internal',
                port: 8888,
                protocol: 'http',
            },
        });
    }

    async healthCheck() {
        try {
            const response = await this.axiosClient.get(`/v1/models?key=${this.apiKey}`);

            return {
                ok: true,
                models: response.data.models?.length ?? 0,
            };
        } catch (error) {
            return {
                ok: false,
                error: this.formatGeminiError(error)
            };
        }
    }

    async generate(prompt: string, params: any = {}): Promise<GeminiGenerateReturnType> {

        const cacheKey = this.cache.buildKey(this.model, prompt, params);

        const cached = this.cache.get(cacheKey);
        if (cached) return cached;
        const maxRetries = 3;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const { data }: { data: GeminiResponse } = await this.axiosClient.post(
                    `/v1/models/${this.model}:generateContent`,
                    {
                        contents: [
                            {
                                parts: [{ text: prompt }],
                            },
                        ],
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-goog-api-key': this.apiKey,
                        },
                    },
                );

                const text =
                    data.candidates?.at(0).content?.parts?.at(0)?.text;
                if (!text) {
                    throw new InternalServerErrorException('Gemini returned no text');
                }

                this.cache.set(cacheKey, text);

                return { text, totalToken: data.usageMetadata.totalTokenCount };

            } catch (error) {
                const status = (error as any).response?.status;

                this.logger.debug(`Status from G-service ${status}`);
                this.logger.debug(error);

                // retry on 503 with exponential backoff
                if (status === StatusCodes.SERVICE_UNAVAILABLE && attempt < maxRetries) {
                    await new Promise(r => setTimeout(r, 500 * attempt));
                    continue;
                }

                // 503
                if (status === StatusCodes.SERVICE_UNAVAILABLE) {
                    throw new HttpException(
                        { message: 'Gemini unavailable' },
                        StatusCodes.SERVICE_UNAVAILABLE,
                    );
                }

                // 429
                if (status === StatusCodes.TOO_MANY_REQUESTS) {
                    throw new HttpException(
                        { message: C.RATE_LIMIT },
                        StatusCodes.TOO_MANY_REQUESTS,
                    );
                }

                throw new HttpException(
                    { message: C.GEMINI_API_REQUEST_FAILED },
                    StatusCodes.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }
}
