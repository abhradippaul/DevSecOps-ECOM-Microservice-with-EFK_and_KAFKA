# ---------- Base ----------
FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build auth

RUN rm -rf node_modules

FROM base AS prod-deps

RUN pnpm install --prod --frozen-lockfile

# ---------- Production ----------
FROM node:current-alpine3.23 AS prod

WORKDIR /app

ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist

CMD ["node", "dist/apps/auth/main.js"]
