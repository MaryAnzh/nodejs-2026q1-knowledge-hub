export const ROUTES = {
  USER: '/user',
  ARTICLE: '/article',
  CATEGORY: '/category',
  COMMENT: '/comment',
  HEALTH: '/health',
  AUTH: '/auth',
  AI: 'ai',
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HEALTH,
  '/auth/signup',
  '/auth/login',
  '/auth/refresh',
  '/doc',
  '/',
  '/ai/test'
];
