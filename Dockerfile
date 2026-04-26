# ---------- STAGE 1: build ----------
FROM node:24 AS builder

WORKDIR /app

# Передаём DATABASE_URL в момент сборки
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

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

# Передаём DATABASE_URL в runtime-этап
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci --omit=dev
RUN npx prisma generate

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/nest-cli.json ./
COPY --from=builder /app/tsconfig*.json ./

RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup
USER appuser

EXPOSE 4000

CMD ["node", "dist/main.js"]