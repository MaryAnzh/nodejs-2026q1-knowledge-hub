import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  BadRequestException,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import * as C from 'src/constants';

@Controller(C.ROUTES.CATEGORY)
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }

    const category = this.service.findOne(id);
    if (!category) {
      throw new NotFoundException();
    }

    return category;
  }

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }

    const category = this.service.findOne(id);
    if (!category) {
      throw new NotFoundException();
    }

    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(C.DELETED_CODE)
  delete(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException();
    }

    const ok = this.service.remove(id);
    if (!ok) {
      throw new NotFoundException();
    }
  }
}
