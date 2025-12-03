FROM node:24-alpine3.21 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:24-alpine3.21 AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup
USER nodeuser

CMD ["node", "dist/server.js"]