import { Injectable } from '@nestjs/common';
import { GeminiService } from '../gemini.service';

@Injectable()
export class RagGeminiService {
    constructor(
        private gemini: GeminiService
    ) { }

    async embed(text: string): Promise<number[]> {
        return await this.gemini.embed(text);
    }
}