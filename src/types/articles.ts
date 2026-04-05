import { ARTICLES_STATUS, ARTICLE_SORT } from 'src/constants';

export type ArticleStatusType =
  (typeof ARTICLES_STATUS)[keyof typeof ARTICLES_STATUS];

export type ArticleSortType = (typeof ARTICLE_SORT)[keyof typeof ARTICLE_SORT];

export type ArticleType = {
  id: string; // uuid v4
  title: string;
  content: string;
  status: ArticleStatusType;
  authorId: string | null; // refers to User
  categoryId: string | null; // refers to Category
  tags: string[]; // array of tag names
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
};

export type ArticleSortEntities = Pick<
  ArticleType,
  'status' | 'categoryId' | 'tags' | 'title' | 'createdAt'
>;
