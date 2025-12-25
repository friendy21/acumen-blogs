# Strapi Production Dockerfile for DigitalOcean
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

# Install runtime dependencies
RUN apk add --no-cache sqlite

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/favicon.png ./favicon.png

# Create data directory
RUN mkdir -p .tmp

# Set production environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=5603

# Expose port
EXPOSE 5603

# Start Strapi
CMD ["npm", "run", "start"]
