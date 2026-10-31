# ==========================================
# Hardened Dockerfile: Multi-stage, Alpine, Non-root User
# ==========================================

# Stage 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install openssl for Prisma engine compatibility on Alpine
RUN apk add --no-cache openssl libc6-compat

# Copy dependency manifests
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY prisma ./prisma
COPY prisma.config.ts ./

# Install dependencies in builder stage
RUN npm install
RUN cd backend && npm install

# Copy application source code
COPY backend ./backend

# Generate Prisma Client and compile NestJS to dist/
RUN npx prisma generate
RUN cd backend && npm run build

# Prune dev dependencies for production
RUN cd backend && npm prune --omit=dev

# ==========================================
# Stage 2: Hardened Runtime stage
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

# Security hardening: Install only minimal runtime dependencies (OpenSSL & dumb-init)
RUN apk add --no-cache openssl dumb-init libc6-compat

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

# Copy artifacts with non-root ownership
COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node prisma.config.ts ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node backend/package*.json ./backend/
COPY --chown=node:node --from=builder /app/backend/node_modules ./backend/node_modules
COPY --chown=node:node --from=builder /app/backend/dist ./backend/dist
COPY --chown=node:node --from=builder /app/backend/src/generated ./backend/dist/generated

# Security Hardening: Switch from root to non-root built-in user 'node'
USER node

EXPOSE 3001

# Use dumb-init to properly handle PID 1 signal forwarding
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["node", "backend/dist/main.js"]
