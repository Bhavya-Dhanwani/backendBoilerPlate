# Multi-stage Dockerfile
# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder
WORKDIR /app

# Copy server package files
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci

# Copy server source code
COPY server/ ./


# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
WORKDIR /app/server

COPY --from=builder /app/server/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/server/src ./src
COPY --from=builder /app/server/server.js ./server.js

EXPOSE 5000
CMD ["node", "server.js"]