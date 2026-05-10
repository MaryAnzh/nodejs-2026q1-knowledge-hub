import { BadRequestException, Body, Controller, Delete, HttpCode, Param, Post } from '@nestjs/common';
import { StatusCodes as SC } from 'http-status-codes';

import { RagService } from './rag.service';
import { RagChatRequest, RagChatResponse, RagFilterType, RagSearchResponseType, ReindexRequestType, SearchResultType } from '../../types';

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
    async search(@Body() body: { query: string, filters?: RagFilterType }): Promise<RagSearchResponseType> {
        if (!body.query) {
            throw new BadRequestException('query is required');
        }
        const results = await this.rag.search(body.query, body.filters);
        return {
            results
        };
    }

    @Post('chat')
    @HttpCode(SC.OK)
    async chat(@Body() body: RagChatRequest): Promise<RagChatResponse> {
        if (!body.question) {
            throw new BadRequestException('Question is required');
        }

        return this.rag.chat(body.question, body.conversationId);
    }

    @Delete('index/articles/:articleId')
    @HttpCode(SC.NO_CONTENT) // 204
    async deleteArticle(@Param('articleId') articleId: string) {
        return this.rag.deleteArticleVectors(articleId);
    }
}