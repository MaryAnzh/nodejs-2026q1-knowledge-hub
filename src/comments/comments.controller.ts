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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StatusCodes as SC } from 'http-status-codes';
import * as C from '../constants';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../auth/decorators/user.decorator';
import { TokenPayloadType } from '../types';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Auth()
@ApiTags(C.COMMENTS)
@Controller(C.ROUTES.COMMENT)
export class CommentsController {
  constructor(private readonly service: CommentsService) { }

  @Get()
  @ApiBearerAuth(C.ACCESS_TOKEN)
  @ApiQuery({ name: 'articleId', required: false })
  @ApiResponse({ status: SC.OK, description: 'List of comments for article' })
  getAll(@Query('articleId') articleId?: string) {
    if (!articleId) return [];
    return this.service.findAll(articleId);
  }

  @Get(':id')
  @ApiBearerAuth(C.ACCESS_TOKEN)
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: SC.OK, description: 'Comment found' })
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid UUID' })
  @ApiResponse({ status: SC.NOT_FOUND, description: 'Comment not found' })
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiBearerAuth(C.ACCESS_TOKEN)
  @Roles(Role.editor, Role.admin)
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: SC.CREATED, description: 'Comment created' })
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid DTO' })
  create(@Body() dto: CreateCommentDto) {
    return this.service.create(dto);
  }

  @Delete(':id')
  @ApiBearerAuth(C.ACCESS_TOKEN)
  @Roles(Role.editor, Role.admin)
  @HttpCode(SC.NO_CONTENT)
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: SC.NO_CONTENT, description: 'Comment deleted' })
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid UUID' })
  @ApiResponse({ status: SC.NOT_FOUND, description: 'Comment not found' })
  delete(
    @Param('id', new ParseUUIDPipe()) id: string,
    @User() user: Omit<TokenPayloadType, 'login'>,
  ) {
    return this.service.remove(id, user);
  }
}
