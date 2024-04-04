ARG APP_GROUP=playgrounds
ARG APP_NAME=remix-hono-vite-with-internal-packages
ARG APP_PKG_NAME=@remix-galaxy/$APP_NAME

# base node image
FROM node:20-bookworm-slim as node
RUN npm i -g turbo

# turbo pruner, keep only necessary monorepo dependencies of the app
FROM node as pruner
ARG APP_PKG_NAME
WORKDIR /app
COPY . .
RUN turbo prune $APP_PKG_NAME --docker
RUN rm -rf ./out/full/*/*/node_modules

# base image
FROM node as base
WORKDIR /app
# Copy only the project's skeleton (folders and package.json
COPY --from=pruner /app/out/json/ .

FROM base AS deps
WORKDIR /app
RUN npm install

FROM base AS builder
ARG APP_PKG_NAME
ENV NODE_ENV production
WORKDIR /app

# Copy all project's source code
COPY --from=pruner /app/out/full/ .
# Merge the dependencies
COPY --from=deps /app/ .
# Build the app and its monorepo dependencies
RUN turbo build --filter=$APP_PKG_NAME...
# Remove all devDependencies
RUN npm prune
# Remove all source code. Keep only necessary files and folders
RUN find ./* -mindepth 2  \
    ! -path '*dist*'  \
    ! -path '*build*'  \
    ! -path '*node_modules*'  \
    ! -name 'package.json'  \
    -exec rm -rf {} +

# Final image
FROM base AS runner
ARG APP_GROUP
ARG APP_NAME
ENV PORT 8080
ENV TZ UTC
ENV NODE_ENV production
WORKDIR /app

# Copy everything built
COPY --from=builder /app/ .
# Set the app folder as the working directory
WORKDIR /app/$APP_GROUP/$APP_NAME
# Start the app. It is the app package.json start script
CMD npm run start