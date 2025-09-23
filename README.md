# 🚀 NASA Farm Navigators - Backend API

API Central em Node.js/TypeScript para o projeto NASA Farm Navigators - Sistema de monitoramento agrícola com dados de satélite.

## 📋 Stack Técnica

- **Runtime**: Node.js 18+
- **Framework**: NestJS + Fastify
- **Linguagem**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JWT
- **Testes**: Jest
- **Linting**: ESLint + Prettier

---

## 🛠️ Setup Inicial

### 1. Inicializar projeto Node.js

```bash
npm init -y
```

### 2. Instalar dependências principais

```bash
npm install @nestjs/core @nestjs/common @nestjs/platform-fastify @nestjs/jwt @nestjs/passport @nestjs/config
npm install @prisma/client bcryptjs jsonwebtoken passport passport-jwt passport-local
npm install class-validator class-transformer
```

### 3. Instalar dependências de desenvolvimento

```bash
npm install -D @nestjs/cli @nestjs/testing typescript @types/node @types/bcryptjs @types/jsonwebtoken @types/passport-jwt @types/passport-local
npm install -D prisma eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier
npm install -D jest @types/jest ts-jest supertest @types/supertest
npm install -D nodemon ts-node
```

### 4. Configurar TypeScript

Criar `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2020",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "paths": {
      "@/*": ["src/*"],
      "@/common/*": ["src/common/*"],
      "@/modules/*": ["src/modules/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 5. Configurar ESLint

Criar `.eslintrc.js`:

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    '@typescript-eslint/recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
```

### 6. Configurar Prettier

Criar `.prettierrc`:

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 80
}
```

### 7. Configurar Scripts no package.json

Adicionar ao `package.json`:

```json
{
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "db:seed": "ts-node prisma/seed.ts"
  }
}
```

---

## 🗂️ Estrutura de Pastas

```
src/
├── app.module.ts           # Módulo principal
├── main.ts                 # Entry point da aplicação
├── common/                 # Utilitários compartilhados
│   ├── decorators/         # Decorators personalizados
│   ├── filters/            # Exception filters
│   ├── guards/             # Guards de autenticação/autorização
│   ├── interceptors/       # Interceptors
│   └── pipes/              # Pipes de validação
├── config/                 # Configurações da aplicação
│   ├── database.config.ts  # Config do banco
│   └── jwt.config.ts       # Config JWT
├── modules/                # Módulos da aplicação
│   ├── auth/               # Autenticação
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── strategies/
│   ├── users/              # Usuários
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── dto/
│   ├── farms/              # Fazendas
│   │   ├── farms.controller.ts
│   │   ├── farms.service.ts
│   │   ├── farms.module.ts
│   │   └── dto/
│   └── alerts/             # Alertas
│       ├── alerts.controller.ts
│       ├── alerts.service.ts
│       ├── alerts.module.ts
│       └── dto/
└── prisma/                 # Schema e migrações do banco
    ├── schema.prisma
    ├── migrations/
    └── seed.ts
```

---

## 🗄️ Configuração do Banco de Dados

### 1. Inicializar Prisma

```bash
npx prisma init
```

### 2. Configurar Schema Básico

Editar `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(FARMER)
  farms     Farm[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Farm {
  id          String   @id @default(cuid())
  name        String
  latitude    Float
  longitude   Float
  area        Float    // em hectares
  cropType    String
  owner       User     @relation(fields: [ownerId], references: [id])
  ownerId     String
  alerts      Alert[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("farms")
}

model Alert {
  id          String      @id @default(cuid())
  type        AlertType
  severity    Severity
  message     String
  isActive    Boolean     @default(true)
  farm        Farm        @relation(fields: [farmId], references: [id])
  farmId      String
  createdAt   DateTime    @default(now())
  resolvedAt  DateTime?

  @@map("alerts")
}

enum Role {
  ADMIN
  FARMER
  ANALYST
}

enum AlertType {
  DROUGHT
  FLOOD
  PEST
  DISEASE
  WEATHER
  SOIL
}

enum Severity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}
```

### 3. Configurar variáveis de ambiente

Criar `.env`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/farm_navigators?schema=public"

# JWT
JWT_SECRET="seu-jwt-secret-super-seguro"
JWT_EXPIRATION="7d"

# App
PORT=3000
NODE_ENV=development

# NASA APIs (para integração futura)
NASA_API_KEY="sua-chave-nasa"
```

---

## 🚀 Comandos para Execução

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# Executar em modo desenvolvimento
npm run start:dev

# Abrir Prisma Studio (opcional)
npm run prisma:studio
```

### Produção

```bash
# Build da aplicação
npm run build

# Executar em produção
npm run start:prod
```

### Testes

```bash
# Executar testes
npm run test

# Testes em modo watch
npm run test:watch

# Testes com coverage
npm run test:cov
```

---

## 🔧 Próximos Passos

1. [ ] Configurar Docker e docker-compose
2. [ ] Implementar módulo de autenticação JWT
3. [ ] Criar endpoints CRUD para usuários
4. [ ] Criar endpoints CRUD para fazendas
5. [ ] Implementar sistema de alertas
6. [ ] Integrar com microserviço Python
7. [ ] Adicionar testes unitários
8. [ ] Configurar CI/CD
9. [ ] Deploy em produção

---

## 🌐 Endpoints Planejados

### Autenticação
- `POST /auth/register` - Cadastro de usuário
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token

### Usuários
- `GET /users/profile` - Perfil do usuário
- `PUT /users/profile` - Atualizar perfil

### Fazendas
- `GET /farms` - Listar fazendas do usuário
- `POST /farms` - Criar fazenda
- `GET /farms/:id` - Detalhe da fazenda
- `PUT /farms/:id` - Atualizar fazenda
- `DELETE /farms/:id` - Remover fazenda

### Alertas
- `GET /alerts` - Listar alertas
- `GET /farms/:id/alerts` - Alertas da fazenda
- `PUT /alerts/:id/resolve` - Resolver alerta

---

## 👥 Responsáveis

- **Backend NodeJS**: Victor
- **Autenticação**: Victor + Nuno
- **Testes**: Nuno

---

## 📝 Notas de Desenvolvimento

- Usar sempre TypeScript com tipagem forte
- Implementar validação com class-validator
- Seguir padrões REST para APIs
- Documentar endpoints com Swagger (futuro)
- Manter testes unitários atualizados
