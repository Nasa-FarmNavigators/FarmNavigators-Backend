# -----------------------------
# STAGE 1: Build
# -----------------------------
FROM node:20 AS build

WORKDIR /app

# Copiar dependências primeiro (cache eficiente)
COPY package*.json ./

# Instalar dependências (dev incluídas porque precisamos do TypeScript e do Prisma)
RUN npm ci

# Copiar o resto do código
COPY . .

# Gerar Prisma client
RUN npx prisma generate

# Compilar TypeScript (usa script build do package.json)
RUN npm run build

# -----------------------------
# STAGE 2: Runtime
# -----------------------------
FROM node:20-slim

WORKDIR /app

# Definir ambiente de produção
ENV NODE_ENV=production

# Copiar apenas o necessário da fase build
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma

# Porta usada pelo NestJS (Fastify)
EXPOSE 3042

# Arrancar a app (usa script start do package.json)
CMD ["npm", "run", "start"]
