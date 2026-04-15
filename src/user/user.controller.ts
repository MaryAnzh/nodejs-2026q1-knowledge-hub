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
import { ApiTags, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { StatusCodes as SC } from 'http-status-codes';

import * as C from '../constants';
import * as T from '../types';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { User } from '../auth/decorators/user.decorator';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Auth()
@ApiTags(C.USER)
@Controller(C.ROUTES.USER)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @ApiResponse({ status: SC.OK, description: 'Get all users' })
  findAll(): Promise<T.ResponseUserType[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'User ID (UUID)' })
  @ApiResponse({ status: SC.OK, description: 'Get user by id' })
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid UUID' })
  @ApiResponse({ status: SC.NOT_FOUND, description: 'User not found' })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<T.ResponseUserType> {
    return this.userService.findOne(id);
  }

  @Post()
  @Roles(Role.admin)
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: SC.CREATED, description: 'User created' })
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid DTO' })
  create(@Body() dto: CreateUserDto): Promise<T.ResponseUserType> {
    return this.userService.create(dto);
  }

  @Put(':id')
  @ApiParam({ name: 'id', description: 'User ID (UUID)' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: SC.OK, description: 'User updated' })
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid UUID or DTO' })
  @ApiResponse({ status: SC.NOT_FOUND, description: 'User not found' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUserDto,
    @User() user: T.TokenPayloadType,
  ): Promise<T.ResponseUserType> {
    return this.userService.update(id, dto, user);
  }

  @Put(':id/role')
  @Roles(Role.admin)
  @ApiParam({ name: 'id', description: 'User ID (UUID)' })
  @ApiBody({ type: UpdateUserRoleDto })
  @ApiResponse({ status: SC.OK, description: C.USer_ROLE_UPDATED })
  @ApiResponse({ status: SC.BAD_REQUEST, description: C.INVALID_UUID_DTO })
  @ApiResponse({ status: SC.NOT_FOUND, description: C.USER_NOT_FOUND })
  updateRole(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.userService.updateRole(id, dto);
  }

  @Delete(':id')
  @HttpCode(SC.NO_CONTENT)
  @ApiParam({ name: 'id', description: 'User ID (UUID)' })
  @ApiResponse({ status: SC.NO_CONTENT, description: 'User deleted' })
  @ApiResponse({ status: SC.BAD_REQUEST, description: 'Invalid UUID' })
  @ApiResponse({ status: SC.NOT_FOUND, description: 'User not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.remove(id);
  }
}
