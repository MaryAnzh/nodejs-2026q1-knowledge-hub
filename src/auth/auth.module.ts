import { Module } from '@nestjs/common';
import { PrismaModule } from '../prismaService/prisma.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessStrategy } from './strategies/access.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessStrategy,
    RefreshStrategy,
  ],
  exports: [AuthService]
})
export class AuthModule { }
