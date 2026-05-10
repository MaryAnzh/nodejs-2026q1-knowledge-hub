import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { StatusCodes as SC } from 'http-status-codes';

import { RagService } from './rag.service';
import { RagSearchResponseType, ReindexRequestType, SearchResultType } from '../../types';

@Controller('ai/rag')
export class RagController {
    constructor(private rag: RagService) { }

    @Post('index')
    @HttpCode(SC.OK) // 200
    async index(@Body() body: ReindexRequestType) {
        return this.rag.indexAllArticles(body);
    }

    @Post('search')
    @HttpCode(SC.OK) // 200
    async search(@Body() body: { query: string }): Promise<RagSearchResponseType> {
        const results = await this.rag.search(body.query);
        return {
            results
        };
    }

    @Post('chat')
    @HttpCode(SC.OK) // 200
    async chat(@Body() body: { query: string }) {
        return this.rag.chat(body.query);
    }
}