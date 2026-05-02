import { Body, Controller, Get, Post, UseGuards, HttpException } from '@nestjs/common';
import { RateLimitGuard } from './rate-limit.guard';
import { GeminiService } from './gemini.service';

import {
  SummarizeArticleDto,
  TranslateArticleDto,
  AnalyzeArticleDto,
} from './dto';

import {
  buildSummarizePrompt,
  buildTranslatePrompt,
  buildAnalyzePrompt,
} from './prompts';

import * as C from '../constants';

import { StatusCodes as SC } from 'http-status-codes';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags(C.ROUTES.AI.toUpperCase())
@UseGuards(RateLimitGuard)
@Controller(C.ROUTES.AI)
export class AiController {
  constructor(
    private readonly gemini: GeminiService,
  ) { }

  @ApiOperation({ summary: 'AI health check' })
  @ApiResponse({ status: SC.OK, description: 'Service is healthy' })
  @Get(C.ROUTES.HEALTH)
  async health() {
    const data = this.gemini.healthCheck();
    return data;
  }

  @ApiOperation({ summary: 'Summarize text' })
  @ApiResponse({ status: SC.CREATED, description: 'Summary generated' })
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({ status: SC.TOO_MANY_REQUESTS, description: 'Rate limit exceeded' })
  @Post(C.AI_ROUTES.SUMMARIZE)
  async summarize(@Body() dto: SummarizeArticleDto) {
    const prompt = buildSummarizePrompt(dto.text, dto.maxLength);
    const summary = await this.gemini.generate(prompt, dto.text, C.AI_ROUTES.SUMMARIZE, { maxLength: dto.maxLength ?? 5 });

    return ({ summary });
  }

  @ApiOperation({ summary: 'Translate text' })
  @ApiResponse({ status: SC.CREATED, description: 'Translation generated' })
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({ status: SC.TOO_MANY_REQUESTS, description: 'Rate limit exceeded' })
  @Post(C.AI_ROUTES.TRANSLATE)
  async translate(@Body() dto: TranslateArticleDto) {
    const prompt = buildTranslatePrompt(dto.text, dto.targetLanguage, dto.sourceLanguage);
    const translation = await this.gemini.generate(prompt, dto.text, C.AI_ROUTES.TRANSLATE, { targetLanguage: dto.targetLanguage ?? '' });
    return ({ translation });
  }

  @ApiOperation({ summary: 'Analyze text' })
  @ApiResponse({ status: SC.CREATED, description: 'Analysis generated' })
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid input' })
  @ApiResponse({ status: SC.TOO_MANY_REQUESTS, description: 'Rate limit exceeded' })
  @Post(C.AI_ROUTES.ANALYZE)
  async analyze(@Body() dto: AnalyzeArticleDto) {
    const prompt = buildAnalyzePrompt(dto.text, dto.task);
    const analysis = await this.gemini.generate(prompt, dto.text, C.AI_ROUTES.ANALYZE, { task: dto.task ?? '' });

    return ({ analysis })
  }
}