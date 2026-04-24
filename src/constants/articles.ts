export const ARTICLES_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;
export const { ARCHIVED, DRAFT, PUBLISHED } = ARTICLES_STATUS;

export const ARTICLE_SORT = { ASC: 'asc', DESC: 'desc' } as const;
export const { ASC, DESC } = ARTICLE_SORT;

export const FIRST_PAGE_COUNT = 1;
export const ITEM_COUNT_IN_PAGE = 10;

export const ARTICLE_STATUS_FLOW = {
  draft: ['published'],
  published: ['archived'],
  archived: [],
} as const;
