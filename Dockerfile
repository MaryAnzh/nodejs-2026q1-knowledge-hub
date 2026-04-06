#---------- STAGE 1: build ----------
FROM node:24-alpine AS builder

# 1) work dir in container
WORKDIR /app

# 2) copy only package-files for cash dependencies
COPY package.json package-lock.json ./

# 3) install (dev + prod) dependencies
RUN npm ci

# 4) copy files
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

# 5) TypeScript → dist build
RUN npm run build

# ---------- STAGE 2: production ----------
FROM node:24-alpine AS production

# 1) environment
ENV NODE_ENV=production

# 2) work dir
WORKDIR /app

# 3) copy packages files from builder
COPY package.json package-lock.json ./

# 4) install prod dependencies
RUN npm ci --omit=dev

# 5) copy dist from builder
COPY --from=builder /app/dist ./dist

# 6)
COPY --from=builder /app/nest-cli.json ./
COPY --from=builder /app/tsconfig*.json ./

# 7) create users non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# 8) app port (from my app)
EXPOSE 4000

# 9) start commands
CMD ["node", "dist/main.js"]