import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { StatusCodes as SC } from 'http-status-codes';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

import * as C from '../constants';
import * as T from '../types';

import { ArticleStatus } from '@prisma/client';

@ApiTags(C.ARTICLES)
@Controller(C.ROUTES.ARTICLE)
export class ArticlesController {
  constructor(private readonly service: ArticlesService) {}

  @Get()
  @ApiResponse({ status: SC.OK, description: 'List of articles' })
  @ApiQuery({ name: 'status', required: false, enum: ArticleStatus })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'tag', required: false, type: 'string' })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: Object.keys({} as T.ArticleSortEntities),
  })
  @ApiQuery({ name: 'order', required: false, enum: C.ARTICLE_SORT })
  getAll(
    @Query('status') status?: ArticleStatus,
    @Query('categoryId') categoryId?: string,
    @Query('tag') tag?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: keyof T.ArticleSortEntities,
    @Query('order') order?: T.ArticleSortType,
  ) {
    if ((page && limit) || sortBy) {
      return this.service.findAllWithQuery({
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy,
        order,
        status,
        categoryId,
        tag,
      });
    }
    return this.service.findAll({ status, categoryId, tag });
  }

  @Get(':id')
  @ApiResponse({ status: SC.OK, description: 'Article found' })
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid UUID' })
  @ApiResponse({ status: SC.NOT_FOUND, description: C.ARTICLE_NOT_FOUND })
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Roles(Role.editor, Role.admin)
  @Post()
  @ApiResponse({ status: SC.CREATED, description: 'Article created' })
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid DTO' })
  create(@Body() dto: CreateArticleDto) {
    return this.service.create(dto);
  }

  @Roles(Role.editor, Role.admin)
  @Put(':id')
  @ApiResponse({ status: SC.OK, description: 'Article updated' })
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid UUID or DTO' })
  @ApiResponse({ status: SC.NOT_FOUND, description: 'Article not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateArticleDto,
  ) {
    return this.service.update(id, dto);
  }

  @Roles(Role.admin)
  @Delete(':id')
  @HttpCode(C.DELETED_CODE)
  @ApiResponse({ status: SC.NO_CONTENT, description: 'Article deleted' })
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid UUID' })
  @ApiResponse({ status: SC.NOT_FOUND, description: 'Article not found' })
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}
