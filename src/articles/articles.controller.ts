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
import { Role } from '@prisma/client';

import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../auth/decorators/user.decorator';

import * as C from '../constants';
import * as T from '../types';

import { ArticleStatus } from '@prisma/client';
import { Auth } from '../auth/decorators/auth.decorator';

@Auth()
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

  @Put(':id')
  @Roles(Role.editor, Role.admin)
  @ApiResponse({ status: SC.OK, description: 'Article updated' })
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid UUID or DTO' })
  @ApiResponse({ status: SC.NOT_FOUND, description: 'Article not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateArticleDto,
    @User() user: Omit<T.TokenPayloadType, 'login'>,
  ) {
    return this.service.update(id, dto, user);
  }

  @Roles(Role.admin, Role.editor)
  @Delete(':id')
  @HttpCode(SC.NO_CONTENT) // 204
  @ApiResponse({ status: SC.NO_CONTENT, description: 'Article deleted' }) // 204
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid UUID' }) // 400
  @ApiResponse({ status: SC.NOT_FOUND, description: 'Article not found' }) // 404
  delete(
    @Param('id', new ParseUUIDPipe()) id: string,
    @User() user: Omit<T.TokenPayloadType, 'login'>,
  ) {
    return this.service.remove(id, user);
  }
}
