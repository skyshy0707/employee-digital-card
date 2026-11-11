# -------- build stage --------
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY ./prisma .
RUN npm ci
RUN npx prisma generate
COPY . .
RUN npm run build

# -------- run stage --------
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000 7860
# При старте контейнера: миграции + сид, затем запуск приложения
# && npx dist/infrastructure/data-access/seed/seed.js && node dist/main.js
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/infrastructure/data-access/seed/seed.js && node dist/main.js"]
