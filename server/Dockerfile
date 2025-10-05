# ===== deps =====
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY --from=deps /app/node_modules /app/node_modules
COPY tsconfig*.json ./
COPY eslint.config.mjs ./
COPY src ./src
RUN npm run build

FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules /app/node_modules
COPY package*.json ./
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]