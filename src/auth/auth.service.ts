import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

import { PrismaService } from '../prismaService/prisma.service';

import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    // ToDo
  }

  async login(dto: LoginDto) {
    // ToDo
  }

  async refresh(dto: RefreshDto) {
    // ToDo
  }

  async generateTokens(user: { id: string; login: string; role: Role }) {
    // ToDo
  }
}
