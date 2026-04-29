import { Controller, UseGuards, Get } from '@nestjs/common';
import { RateLimitGuard } from './rate-limit.guard';
import { GeminiService } from './gemini.service';

import * as C from '../constants';

@UseGuards(RateLimitGuard)
@Controller(C.ROUTES.AI)
export class AiController {
    constructor(private readonly gemini: GeminiService) { }

    @Get('test')
    async test() {
        const prompt = 'Say hello from Gemini';
        return this.gemini.generate(prompt);
    }
}