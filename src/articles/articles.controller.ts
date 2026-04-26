import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  BadRequestException,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

import * as C from '../constants';
import {
  ArticleSortEntities,
  ArticleSortType,
  ArticleStatusType,
} from 'src/types';

@Controller(C.ROUTES.ARTICLE)
export class ArticlesController {
  constructor(private readonly service: ArticlesService) {}

  @Get()
  getAll(
    @Query('status') status?: ArticleStatusType,
    @Query('categoryId') categoryId?: string,
    @Query('tag') tag?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: keyof ArticleSortEntities,
    @Query('order') order?: ArticleSortType,
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

  @Get('paginated')
  getPaginated(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: keyof ArticleSortEntities,
    @Query('order') order?: ArticleSortType,
  ) {
    return this.service.findAllWithQuery({
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy,
      order,
    });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    if (!isUUID(id)) throw new BadRequestException();

    const article = this.service.findOne(id);
    if (!article) throw new NotFoundException(C.USER_NOT_FOUND);

    return article;
  }

  @Post()
  create(@Body() dto: CreateArticleDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    if (!isUUID(id)) throw new BadRequestException();

    const article = this.service.findOne(id);
    if (!article) throw new NotFoundException(C.ARTICLE_NOT_FOUND);

    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(C.DELETED_CODE)
  delete(@Param('id') id: string) {
    if (!isUUID(id)) throw new BadRequestException();

    const ok = this.service.remove(id);
    if (!ok) throw new NotFoundException(C.ARTICLE_NOT_FOUND);

    return;
  }
}
