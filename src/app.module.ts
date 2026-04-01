import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ArticlesModule, CategoriesModule, CommentsModule, UserModule],
  exports: [ArticlesModule, CategoriesModule, CommentsModule, UserModule],
})
export class AppModule {
  constructor() {
    console.log('App exports');
  }
}
