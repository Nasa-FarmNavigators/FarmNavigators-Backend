# 🛡️ Sistema de Roles e Permissões - Guia do Victor

## 🎯 **Como funciona o Passport + Roles:**

### 1. **Passport Strategies:**

- `LocalStrategy` → Valida login (email/password)
- `JwtStrategy` → Valida token JWT nas rotas protegidas

### 2. **Guards:**

- `JwtAuthGuard` → Verifica se usuário está logado
- `RolesGuard` → Verifica se usuário tem a role necessária

### 3. **Decorators:**

- `@Roles(Role.ADMIN)` → Define quem pode acessar
- `@CurrentUser()` → Pega dados do usuário autenticado

## 📋 **Exemplo de uso:**

```typescript
@Get('admin-only')
@UseGuards(JwtAuthGuard, RolesGuard)  // 1. Verificar se está logado
@Roles(Role.ADMIN)                    // 2. Verificar se é ADMIN
@ApiBearerAuth()                      // 3. Swagger: pedir token
async adminEndpoint(@CurrentUser() user: any) {
  return `Olá ${user.name}, você é ADMIN!`;
}
```

## 🔐 **Roles disponíveis:**

- `ADMIN` → Pode tudo
- `FARMER` → Suas próprias fazendas
- `ANALYST` → Suas próprias fazendas

## 🚀 **Fluxo completo:**

1. **Login** → POST /api/auth/login
2. **Recebe token** → `Bearer eyJ...`
3. **Usa token** → Header: `Authorization: Bearer eyJ...`
4. **Guards verificam** → JWT válido + Role correta
5. **Acesso liberado** → Controller executa

## 📖 **Endpoints protegidos criados:**

### Users (ADMIN apenas):

- GET /api/users → Listar usuários
- GET /api/users/:id → Ver usuário
- PATCH /api/users/:id → Editar usuário
- DELETE /api/users/:id → Deletar usuário

### Farms (Logado + próprias fazendas):

- Todos os endpoints de fazendas
- ADMIN vê todas, outros só as suas

Agora está tudo protegido e com roles funcionando! 🔥
