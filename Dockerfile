# ─────────────────────────────────────────
# STAGE 1: Dependencies
# ─────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Copy package manifests & Prisma schema
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install all dependencies including devDependencies for build
RUN pnpm install --frozen-lockfile

# ─────────────────────────────────────────
# STAGE 2: Builder
# ─────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js with standalone output
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN pnpm run build

# ─────────────────────────────────────────
# STAGE 3: Runner
# ─────────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install exact Prisma CLI version to prevent version mismatch
RUN npm install -g prisma@6.19.3

# Create non-root system user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and standalone server
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/docker-entrypoint.sh ./docker-entrypoint.sh

# Grant execute permission to entrypoint script
RUN chmod +x ./docker-entrypoint.sh

# Ensure prisma folder has write permission for SQLite db & uploads
RUN mkdir -p /app/prisma && chown -R nextjs:nodejs /app/prisma

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
