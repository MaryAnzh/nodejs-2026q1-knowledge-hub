export const ROUTES = {
  USER: '/user',
  ARTICLE: '/article',
  CATEGORY: '/category',
  COMMENT: '/comment',
  HEALTH: '/health',
  AUTH: '/auth',
} as const;

export const PUBLIC_ROUTES = [
  '/health',
  '/auth/signup',
  '/auth/login',
  '/auth/refresh',
  '/doc',
  '/',
];
