import { Injectable } from '@nestjs/common';

@Injectable()
export class RagGeminiService {
    async embed(text: string): Promise<number[]> {
        return Array.from({ length: 128 }, () => Math.random());
    }
}