import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusCodes as SC } from 'http-status-codes';

import * as C from '../constants';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Auth()
@ApiTags(C.CATEGORIES)
@Controller(C.ROUTES.CATEGORY)
export class CategoriesController {
  constructor(private readonly service: CategoriesService) { }

  @Get()
  @ApiBearerAuth(C.ACCESS_TOKEN)
  @ApiResponse({ status: SC.OK, description: 'List of categories' })
  getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiBearerAuth(C.ACCESS_TOKEN)
  @ApiParam({ name: 'id', example: 'a3f1c8b2-4c9e-4e7a-9d7f-123456789abc' })
  @ApiResponse({ status: SC.OK, description: 'Category found' })
  @ApiResponse({ status: SC.NOT_FOUND, description: 'Category not found' })
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiBearerAuth(C.ACCESS_TOKEN)
  @Roles(Role.admin)
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: SC.CREATED, description: 'Category created' })
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiBearerAuth(C.ACCESS_TOKEN)
  @Roles(Role.admin)
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: SC.OK, description: 'Category updated' })
  @ApiResponse({ status: SC.NOT_FOUND, description: 'Category not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth(C.ACCESS_TOKEN)
  @Roles(Role.admin)
  @HttpCode(SC.NO_CONTENT)
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: SC.NO_CONTENT, description: 'Category deleted' })
  @ApiResponse({ status: SC.NOT_FOUND, description: 'Category not found' })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
