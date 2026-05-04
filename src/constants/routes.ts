export const ROUTES = {
  USER: '/user',
  ARTICLE: '/article',
  CATEGORY: '/category',
  COMMENT: '/comment',
  HEALTH: '/health',
  AUTH: '/auth',
  AI: '/ai',
} as const;

const { AI } = ROUTES;
export const AI_ROUTES = {
  SUMMARIZE: `summarize`,
  TRANSLATE: `translate`,
  ANALYZE: `analyze`,
  CHAT: 'chat',
} as const;

export const FULL_AI_ROUTES = {
  SUMMARIZE: `${AI}/${AI_ROUTES.SUMMARIZE}`,
  TRANSLATE: `${AI}/${AI_ROUTES.TRANSLATE}`,
  ANALYZE: `${AI}/${AI_ROUTES.ANALYZE}`,
  HEALTH: `${AI}${ROUTES.HEALTH}`,
  CHAT:`${AI}/${AI_ROUTES.CHAT}`,
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HEALTH,
  '/auth/signup',
  '/auth/login',
  '/auth/refresh',
  '/doc',
  '/',
  FULL_AI_ROUTES.ANALYZE,
  FULL_AI_ROUTES.HEALTH,
  FULL_AI_ROUTES.SUMMARIZE,
  FULL_AI_ROUTES.TRANSLATE,
  FULL_AI_ROUTES.CHAT
];
