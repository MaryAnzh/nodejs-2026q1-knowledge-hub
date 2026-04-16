import { Controller, Post, Body, HttpCode, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StatusCodes as SC } from 'http-status-codes';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

import * as C from '../constants';
import { invalidatedRefreshTokens } from './token-store';

@ApiTags(C.AUTH)
@Controller(C.ROUTES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: SC.CREATED }) //201
  @ApiResponse({ status: SC.BAD_REQUEST }) //400
  @Throttle(5, 60)
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: SC.OK }) // 200
  @ApiResponse({ status: SC.BAD_REQUEST }) // 400
  @ApiResponse({ status: SC.FORBIDDEN }) // 403
  @Throttle(5, 60)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(200) // 200
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({ status: SC.OK }) // 200
  @ApiResponse({ status: SC.UNAUTHORIZED }) // 401
  @ApiResponse({ status: SC.FORBIDDEN }) // 403
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post('logout')
  async logout(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    invalidatedRefreshTokens.add(refreshToken);
    return { message: 'Logged out successfully' };
  }
}
