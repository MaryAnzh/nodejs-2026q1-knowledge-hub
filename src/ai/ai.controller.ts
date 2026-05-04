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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AiObservabilityService } from './observability.service';
import { User } from '../auth/decorators/user.decorator';
import { TokenPayloadType } from '../types';
import { AiSessionService } from './ai-session.service';
import { buildChatPrompt } from './prompts/chat.prompt';

@ApiTags(C.ROUTES.AI.toUpperCase())
@UseGuards(RateLimitGuard)
@Controller(C.ROUTES.AI)
export class AiController {
  constructor(
    private readonly gemini: GeminiService,
    private readonly observability: AiObservabilityService,
    private readonly sessions: AiSessionService,
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
  @ApiBearerAuth(C.ACCESS_TOKEN)
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
  @ApiBearerAuth(C.ACCESS_TOKEN)
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

  @ApiOperation({
    summary: 'AI diagnostics and metrics',
    description: 'Returns AI observability metrics including latency, cache hit ratio, last status and last error.',
  })
  @ApiResponse({
    status: SC.OK, // 200
    description: 'Diagnostics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        lastLatencyMs: { type: 'number', example: 120 },
        avgLatencyMs: { type: 'number', example: 150 },
        cacheHitRatio: { type: 'number', example: 0.67 },
        lastStatus: { type: 'number', example: 200 },
        lastError: { type: 'string', example: 'Gemini unavailable' },
        timestamp: { type: 'string', example: '2026-05-02T12:11:17.000Z' },
      },
    },
  })
  @Get(C.AI_ROUTES.DIAGNOSTICS)
  getDiagnostics() {
    return this.observability.getMetrics();
  }

  @ApiOperation({
    summary: 'Chat with AI (session-based memory)',
    description:
      'Allows the user to chat with the AI using short-term session memory. ' +
      'If no sessionId is provided, a new session is created. ' +
      'The AI remembers the last few messages within the session.',
  })
  @ApiResponse({
    status: SC.OK, // 200
    description: 'AI reply with session context',
    schema: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          example: 'a8f3k9d2',
        },
        reply: {
          type: 'string',
          example: 'Sure, here is the continuation of our conversation...',
        },
      },
    },
  })
  @ApiBearerAuth(C.ACCESS_TOKEN)
  @Post(C.AI_ROUTES.CHAT)
  async chat(
    @Body() body: { text: string; sessionId?: string },
    @User() user: Pick<TokenPayloadType, 'login'>
  ) {
    const sessionId = body.sessionId ?? this.sessions.createSessionId();

    const history = this.sessions.getSession(sessionId);

    const prompt = buildChatPrompt(history, body.text, user.login);

    const reply = await this.gemini.generate(
      prompt,
      body.text,
      C.AI_ROUTES.CHAT,
      { sessionId }
    );

    this.sessions.saveMessage(sessionId, C.USER, body.text);
    this.sessions.saveMessage(sessionId, C.ASSISTANT, reply);

    return {
      sessionId,
      reply,
    };
  }
}