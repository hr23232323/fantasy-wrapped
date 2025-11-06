# Stage 1: Build the Next.js application
FROM --platform=linux/amd64 node:20-slim AS build

WORKDIR /app

# Install dependencies required for node-gyp
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and lockfile
COPY package.json package-lock.json ./

# Install all dependencies for build
RUN npm ci --legacy-peer-deps --network-timeout=1000000

# Copy the rest of the app
COPY . .

# Build
RUN npm run build

# Stage 2: Create Production Image
FROM --platform=linux/amd64 node:20-slim

WORKDIR /app

# Copy necessary files from build stage
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Install production dependencies only
RUN npm ci --omit=dev --legacy-peer-deps --network-timeout=1000000 \
    && rm -rf /tmp/*

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Expose port and start the app
EXPOSE 3000
CMD ["npm", "run", "start"]
