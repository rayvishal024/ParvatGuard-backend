FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/knexfile.ts ./knexfile.ts
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/seeds ./seeds

# Expose port
EXPOSE 3000

# Run migrations and start server
CMD ["sh", "-c", "npm run migrate:latest && npm start"]

