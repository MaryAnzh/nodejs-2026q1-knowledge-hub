import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  ApiTags,
  ApiQuery,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { StatusCodes as SC } from 'http-status-codes';
import * as C from '../constants';

@ApiTags(C.COMMENTS)
@Controller(C.ROUTES.COMMENT)
export class CommentsController {
  constructor(private readonly service: CommentsService) { }

  @Get()
  @ApiQuery({ name: 'articleId', required: false })
  @ApiResponse({ status: SC.OK, description: 'List of comments for article' })
  getAll(@Query('articleId') articleId?: string) {
    if (!articleId) return [];
    return this.service.findAll(articleId);
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: SC.OK, description: 'Comment found' })
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid UUID' })
  @ApiResponse({ status: SC.NOT_FOUND, description: 'Comment not found' })
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: SC.CREATED, description: 'Comment created' })
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid DTO' })
  create(@Body() dto: CreateCommentDto) {
    console.log('dto');
    console.log(dto);
    return this.service.create(dto);
  }

  @Delete(':id')
  @HttpCode(SC.NO_CONTENT)
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: SC.NO_CONTENT, description: 'Comment deleted' })
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid UUID' })
  @ApiResponse({ status: SC.NOT_FOUND, description: 'Comment not found' })
  delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.remove(id);
  }
}