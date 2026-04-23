import { Module } from '@nestjs/common';

import { PrismaModule } from '../prismaService/prisma.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
