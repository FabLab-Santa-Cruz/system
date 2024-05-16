# Stage 1: Build the application, All this steps are required to use bun lock. 
# Check https://github.com/prisma/prisma/issues/21241
FROM ubuntu:22.04 as base
# Install necessary packages
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl && rm -rf /var/lib/apt/lists/*
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y unzip
RUN npm install -g bun

# Set up the working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and bun.lockb files
COPY package.json ./
COPY bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the application files
COPY . .

# Define build arguments
ARG NODE_ENV
ARG DATABASE_URL
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG MINIO_KEY
ARG MINIO_SECRET
ARG MINIO_ENDPOINT
ARG NEXT_PUBLIC_STORAGE_PATH
ARG BIO_KEY
ARG DISCORD_CLIENT_ID
ARG DISCORD_CLIENT_SECRET
ARG NEXT_TELEMETRY_DEBUG
ARG WEATHER_API_KEY
ARG WEATHER_API_URL

# Generate Prisma client
RUN bun run prisma generate
RUN bun run prisma migrate deploy
# Build the application
RUN bun run build

# Stage 2: Final application image
FROM node:20-alpine as runner

# Set up the working directory
WORKDIR /app

# Copy built files from the previous stage
COPY --from=base /usr/src/app/.next/standalone ./
COPY --from=base /usr/src/app/.next/static ./.next/static
#Copy public folder
COPY --from=base /usr/src/app/public ./public

# Expose port 3000
EXPOSE 3000

# Set environment variables
ENV PORT=3000
# Define run arg
ARG NODE_ENV
# Run the application
CMD [ "node", "server.js" ]
