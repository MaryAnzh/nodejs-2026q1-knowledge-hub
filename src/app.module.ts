import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { ArticlesModule } from './articles/articles.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { UserModule } from './user/user.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prismaService/prisma.module';
import { AuthModule } from './auth/auth.module';

import { AccessGuard } from './auth/guards/access.guard';

import { AppController } from './app.controller';
import { AppService } from './app-service';
import { AppLoggerModule } from './logger/logger.module';
import * as C from './constants';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    AuthModule,
    ArticlesModule,
    CategoriesModule,
    CommentsModule,
    UserModule,
    HealthModule,
    PrismaModule,
    AppLoggerModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessGuard, // check JWT
    },
  ],
})
export class AppModule {
  constructor() {
    console.log(C.APP_EXPORTS);
  }
}
