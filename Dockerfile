# ---------- STAGE 1: build ----------
FROM node:24 AS builder

WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN mkdir -p /app/logs && chown -R node:node /app/logs
RUN mkdir -p /app/ai-stat && chown -R node:node /app/ai-stat
COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci
RUN npx prisma generate

COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

RUN npm run build


# ---------- STAGE 2: production ----------
FROM node:24 AS production

ENV NODE_ENV=production
WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci --omit=dev
RUN npx prisma generate

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/nest-cli.json ./
COPY --from=builder /app/tsconfig*.json ./

RUN mkdir -p /app/logs
RUN mkdir -p /app/ai-stat
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup
RUN chown -R appuser:appgroup /app/logs
USER appuser

EXPOSE 4000

# ENV HTTP_PROXY=http://host.docker.internal:8888
# ENV HTTPS_PROXY=http://host.docker.internal:8888
CMD ["node", "dist/main.js"]