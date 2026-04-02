import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';

import * as C from '../constants';
import * as T from '../types';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller(C.ROUTES.USER)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  findAll(): T.UserType[] {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(C.USER_NOT_FOUND);
    }
    return user;
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    const user = this.userService.update(id, dto);
    if (!user) {
      throw new NotFoundException(C.USER_NOT_FOUND);
    }
    return user;
  }

  @Delete(':id')
  @HttpCode(C.DELETED_CODE)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    const deleted = this.userService.remove(id);
    if (!deleted) {
      throw new NotFoundException(C.USER_NOT_FOUND);
    }
    return null;
  }
}
