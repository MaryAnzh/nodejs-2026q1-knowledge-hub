import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import * as C from '../constants';

import { AiCacheService } from './cache.service';
type GeminiErr = { code: number; message: string, status: string, details: any[] };


@Injectable()
export class GeminiService {
    private axiosClient: any;
    private readonly apiKey: string;
    private readonly baseUrl: string;
    private readonly model: string;
    private formatGeminiError(error: any) {
        const status = error.response?.status;
        const code = error.response?.data?.error?.code;
        const message = error.response?.data?.error?.message;
        const details = error.response?.data?.error?.details;

        return `
❌ Gemini API Error
-------------------------
HTTP Status: ${status ?? "unknown"}
Error Code: ${code ?? "unknown"}
Message: ${message ?? "no message"}
Details: ${JSON.stringify(details, null, 2) ?? "none"}
-------------------------
Request URL: ${error.config?.url}
Model: ${error.config?.url?.split("/models/")[1]}
    `;
    }

    constructor(
        private readonly config: ConfigService,
        private readonly cache: AiCacheService,
    ) {
        this.apiKey = this.config.get<string>(C.GEMINI_API_KEY);
        this.baseUrl = this.config.get<string>(C.GEMINI_API_BASE_URL);
        this.model = this.config.get<string>(C.GEMINI_MODEL);
        this.axiosClient = axios.create({
            baseURL: this.baseUrl,
            proxy: {
                host: 'host.docker.internal',
                port: 8888,
                protocol: 'http'
            }
        });
    }

    async generate(prompt: string, params: any = {}) {
        const cacheKey = this.cache.buildKey(this.model, prompt, params);

        const cached = this.cache.get(cacheKey);
        if (cached) return cached;

        try {
            const response = await this.axiosClient.post(
                `${this.baseUrl}/v1/models/${this.model}:generateContent`,
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
                response.data?.candidates?.[0]?.content?.parts?.[0]?.text ??
                'No response';

            this.cache.set(cacheKey, text);

            return text;
        } catch (error) {
            console.log(this.formatGeminiError(error));
            throw new InternalServerErrorException(C.GEMINI_API_REQUEST_FAILED);
        }
    }
}