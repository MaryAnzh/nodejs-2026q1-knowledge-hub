import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { UserModule } from './user/user.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ArticlesModule,
    CategoriesModule,
    CommentsModule,
    UserModule,
    StorageModule],
})
export class AppModule {
  constructor() {
    console.log('App exports');
  }
}
