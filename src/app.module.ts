import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { UserModule } from './user/user.module';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prismaService/prisma.module';

import { AppController } from './app.controller';
import { AppService } from './app-service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ArticlesModule,
    CategoriesModule,
    CommentsModule,
    UserModule,
    HealthModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log('App exports');
  }
}
