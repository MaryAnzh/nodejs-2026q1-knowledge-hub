import { Article } from '@prisma/client';
import { ARTICLE_SORT } from '../constants';

export type ArticleSortType = (typeof ARTICLE_SORT)[keyof typeof ARTICLE_SORT];

export type ArticleQueryType = Pick<Article, 'categoryId' | 'status'> & {
  tag: string;
};

export type ArticleType = Omit<Article, 'createdAt' | 'updatedAt'> & {
  tags: string[]; // array of tag names
  createdAt: number;
  updatedAt: number;
};
export type SortKeysType = keyof (Pick<ArticleType, 'status' | 'categoryId' | 'tags'>)

export type ArticleSortEntities = Pick<
  ArticleType,
  'title' | 'createdAt' | 'updatedAt'
>;

export type ArticleSortQueryType = ArticleQueryType & {
  page?: number;
  limit?: number;
  sortBy?: keyof ArticleSortEntities;
  order?: ArticleSortType;
}

export type ArticleSortResultType = {
  total: number;
  page: number;
  limit: number;
  data: ArticleType[];
}
