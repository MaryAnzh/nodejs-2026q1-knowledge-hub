import { Injectable } from '@nestjs/common';
import { GeminiService } from '../gemini.service';

@Injectable()
export class RagGeminiService {
    constructor(
        private gemini: GeminiService
    ) {

    }
    async embed(text: string): Promise<number[]> {
        return Array.from({ length: 128 }, () => Math.random());
    }

    async generate(prompt: string): Promise<string> {
        //return this.gemini.generate(prompt, 'text', '...');
        return `Mock answer for: ${prompt.slice(0, 50)}...`;
    }
}