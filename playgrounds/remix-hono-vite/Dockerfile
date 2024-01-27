ARG APP_GROUP=playgrounds
ARG APP_NAME=remix-hono-vite
ARG APP_PKG_NAME=@remix-galaxy/$APP_NAME

# base node image
FROM node:20-bookworm-slim as node
RUN npm i -g turbo

# pruner
FROM node as pruner
ARG APP_PKG_NAME
WORKDIR /app
COPY . .
RUN turbo prune $APP_PKG_NAME --docker
RUN rm -rf ./out/full/*/*/node_modules

# base node image
FROM node as base
WORKDIR /app
COPY --from=pruner /app/out/json/ .

FROM base AS dev-deps
WORKDIR /app
RUN npm install

FROM base AS production-deps
WORKDIR /app
ENV NODE_ENV production
RUN npm install --production

FROM base AS builder
ARG APP_PKG_NAME
WORKDIR /app
ENV NODE_ENV production
COPY --from=pruner /app/out/full/ .
COPY --from=dev-deps /app/ .
COPY turbo.json turbo.json
RUN turbo build --filter=$APP_PKG_NAME

# Final image
FROM base AS runner
ARG APP_GROUP
ARG APP_NAME
ENV PORT 8080
ENV TZ UTC
ENV NODE_ENV production
WORKDIR /app

COPY --from=production-deps /app .
COPY --from=builder /app/$APP_GROUP/$APP_NAME/package.json ./$APP_GROUP/$APP_NAME/package.json
COPY --from=builder /app/$APP_GROUP/$APP_NAME/build ./$APP_GROUP/$APP_NAME/build

WORKDIR /app/$APP_GROUP/$APP_NAME

# It is the app package.json
CMD [ "npm", "run", "start" ]