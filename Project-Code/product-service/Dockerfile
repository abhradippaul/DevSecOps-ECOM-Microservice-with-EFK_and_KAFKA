FROM node:22-alpine AS builder

RUN corepack enable

WORKDIR /app

COPY *.json pnpm-lock.yaml ./
# RUN pnpm install -D tsc
RUN pnpm install --frozen-lockfile
COPY . .

RUN pnpm run build

FROM node:22-alpine AS production

RUN corepack enable

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/dist ./dist

RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup
USER nodeuser

CMD ["pnpm", "start"]