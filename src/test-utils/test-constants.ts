import { Article } from '@prisma/client';
import { DRAFT, PUBLISHED } from '../constants';

export const {
  TEST_ID,
  TEST_ID_2,
  TEST_LOGIN,
  TEST_PASS,
  TEST_DEF_ROLE,
  TEST_OLD_PASS,
  TEST_NEW_PASS,
  TEST_HASHED,
  TEST_NEW_HASH,
  TEST_SALT,
  TEST_WRONG_HASH,
  TEST_TOKEN,
  UPDATED,
  TEST_USER_ID,
  TEST_USER_ID_2,
} = {
  TEST_ID: '1',
  TEST_ID_2: '2',
  TEST_LOGIN: 'Alice',
  TEST_PASS: '12345',
  TEST_DEF_ROLE: 'viewer',
  TEST_OLD_PASS: 'old',
  TEST_NEW_PASS: 'new',
  TEST_SALT: 'salt',
  TEST_HASHED: 'hashed',
  TEST_NEW_HASH: 'new-hash',
  TEST_WRONG_HASH: 'wrong-hash',
  TEST_TOKEN: 'a.b.c',
  UPDATED: 'Updated',
  TEST_USER_ID: 'user_1',
  TEST_USER_ID_2: 'user_2',
} as const;

export const { TEST_DTO, TEST_USER_RESPONSE } = {
  TEST_DTO: { login: TEST_LOGIN, password: TEST_PASS },
  TEST_USER_RESPONSE: {
    id: TEST_ID,
    login: TEST_LOGIN,
    role: TEST_DEF_ROLE,
  } as const,
};

export const TEST_ARTICLES: (Article & { tags: string[] })[] = [
  {
    id: TEST_ID,
    title: 'Article 1',
    content: 'article content',
    authorId: null,
    status: DRAFT,
    categoryId: null,
    createdAt: new Date('01/01/2026'),
    updatedAt: new Date('01/01/2026'),
    tags: [],
  },
  {
    id: TEST_ID_2,
    title: 'Article 2',
    content: 'article content 2',
    authorId: null,
    status: PUBLISHED,
    categoryId: null,
    createdAt: new Date('01/02/2026'),
    updatedAt: new Date('01/02/2026'),
    tags: [],
  },
];

export const TEST_COMMENTS = [
  {
    id: TEST_ID,
    content: 'comment text',
    articleId: TEST_ID_2,
    authorId: TEST_USER_ID,
    createdAt: new Date(1777029786866),
  },
];

export const TEST_CATEGORIES = [
  {
    id: 'cat1',
    name: 'Category 1',
    description: 'Description 1',
  },
  {
    id: 'cat2',
    name: 'Category 2',
    description: 'Description 2',
  },
];
