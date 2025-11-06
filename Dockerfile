# ===========================================
# Pony Town - Multi-stage Docker Build
# ===========================================
# Stage 1: Build Stage
FROM node:22-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    imagemagick

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (with legacy peer deps for Angular compatibility)
RUN npm ci --legacy-peer-deps --only=production && \
    npm cache clean --force

# Copy source code
COPY . .

# Compile TypeScript
RUN npm run ts

# Build production assets
RUN npm run build

# ===========================================
# Stage 2: Production Stage
FROM node:22-alpine

# Install runtime dependencies
RUN apk add --no-cache \
    imagemagick \
    tini

WORKDIR /app

# Copy production dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy compiled code and assets
COPY --from=builder /app/src/scripts ./src/scripts
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/views ./views
COPY --from=builder /app/favicons ./favicons

# Copy essential files
COPY --from=builder /app/pony-town.js ./
COPY --from=builder /app/package.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S ponytown -u 1001 && \
    chown -R ponytown:nodejs /app

USER ponytown

# Expose ports
EXPOSE 8090 8091

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s \
    CMD node -e "require('http').get('http://localhost:8090/api/state', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use tini to handle signals properly
ENTRYPOINT ["/sbin/tini", "--"]

# Start the game server
CMD ["node", "pony-town.js", "--login", "--admin", "--game"]
