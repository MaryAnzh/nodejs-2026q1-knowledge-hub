import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Query,
    Body,
    BadRequestException,
    NotFoundException,
    UnprocessableEntityException,
    HttpCode,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import * as C from 'src/constants';

@Controller(C.ROUTES.COMMENT)
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService,
    ) { }

    @Get()
    getAll(@Query('articleId') articleId: string) {
        if (!articleId) {
            throw new BadRequestException('articleId is required');
        }

        if (!isUUID(articleId)) {
            throw new BadRequestException();
        }

        return this.commentsService.findByArticle(articleId);
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        if (!isUUID(id)) {
            throw new BadRequestException();
        }

        const comment = this.commentsService.findOne(id);
        if (!comment) {
            throw new NotFoundException();
        }

        return comment;
    }

    @Post()
    create(@Body() dto: CreateCommentDto) {
        if (!isUUID(dto.articleId)) {
            throw new BadRequestException();
        }

        return this.commentsService.create(dto);
    }

    @Delete(':id')
    @HttpCode(C.DELETED_CODE)
    delete(@Param('id') id: string) {
        if (!isUUID(id)) {
            throw new BadRequestException();
        }

        const ok = this.commentsService.remove(id);
        if (!ok) {
            throw new NotFoundException();
        }
    }
}