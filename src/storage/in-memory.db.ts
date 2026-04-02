import { Injectable } from '@nestjs/common';
import * as T from '../types';

@Injectable()
export class InMemoryDB {
    users: T.UserType[] = [];
    articles: T.ArticleType[] = [];
    categories: T.CategoryType[] = [];
    comments: T.CommentType[] = [];
}