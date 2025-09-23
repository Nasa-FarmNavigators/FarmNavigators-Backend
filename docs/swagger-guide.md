# 📚 Guia de Documentação da API com Swagger

## 🎯 Como Adicionar Exemplos nas Responses

### 1. Decorators Básicos do Swagger

```typescript
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse,
  ApiProperty 
} from '@nestjs/swagger';
```

### 2. Documentando um Controller

```typescript
@ApiTags('Users') // Agrupa endpoints por categoria
@Controller('users')
export class UsersController {
  
  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar usuário por ID',
    description: 'Retorna os dados completos de um usuário específico'
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    example: {
      success: true,
      message: 'Usuário encontrado',
      data: {
        id: 'cm1k2x3y4z5a6b7c8d9e0f1g',
        email: 'joao@fazenda.com',
        name: 'João Silva',
        role: 'FARMER'
      },
      timestamp: '2025-09-23T14:56:10.123Z'
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    example: {
      statusCode: 404,
      message: 'User not found',
      error: 'Not Found'
    }
  })
  async findOne(@Param('id') id: string) {
    // implementação...
  }
}
```

### 3. Usando DTOs para Documentação

```typescript
export class CreateUserDto {
  @ApiProperty({ 
    description: 'Email do usuário',
    example: 'joao@fazenda.com',
    format: 'email'
  })
  email: string;

  @ApiProperty({ 
    description: 'Senha do usuário',
    example: 'MinhaSenh@123',
    minLength: 8
  })
  password: string;

  @ApiProperty({ 
    description: 'Nome completo',
    example: 'João da Silva',
    minLength: 2,
    maxLength: 100
  })
  name: string;

  @ApiProperty({ 
    description: 'Papel do usuário',
    enum: ['ADMIN', 'FARMER', 'ANALYST'],
    example: 'FARMER'
  })
  role: Role;
}
```

### 4. Responses com Arrays

```typescript
@ApiResponse({
  status: 200,
  description: 'Lista de fazendas do usuário',
  example: {
    success: true,
    message: 'Fazendas encontradas',
    data: [
      {
        id: 'farm1',
        name: 'Fazenda São João',
        latitude: -15.7942,
        longitude: -47.8822,
        area: 150.5,
        cropType: 'Soja'
      },
      {
        id: 'farm2',
        name: 'Fazenda Santa Maria',
        latitude: -16.2345,
        longitude: -48.1234,
        area: 200.0,
        cropType: 'Milho'
      }
    ],
    meta: {
      total: 2,
      page: 1,
      limit: 10
    },
    timestamp: '2025-09-23T14:56:10.123Z'
  }
})
```

### 5. Documentando Request Body

```typescript
@Post()
@ApiOperation({ summary: 'Criar nova fazenda' })
@ApiResponse({
  status: 201,
  description: 'Fazenda criada com sucesso',
  example: {
    success: true,
    message: 'Fazenda criada com sucesso',
    data: {
      id: 'cm1k2x3y4z5a6b7c8d9e0f1h',
      name: 'Fazenda São João',
      latitude: -15.7942,
      longitude: -47.8822,
      area: 150.5,
      cropType: 'Soja',
      ownerId: 'cm1k2x3y4z5a6b7c8d9e0f1g',
      createdAt: '2025-09-23T14:56:10.123Z'
    }
  }
})
@ApiResponse({
  status: 400,
  description: 'Dados inválidos',
  example: {
    statusCode: 400,
    message: [
      'name should not be empty',
      'latitude must be a number',
      'area must be a positive number'
    ],
    error: 'Bad Request'
  }
})
async create(@Body() createFarmDto: CreateFarmDto) {
  // implementação...
}
```

### 6. Autenticação na Documentação

```typescript
// No main.ts
const config = new DocumentBuilder()
  .setTitle('FarmNavigators API')
  .setDescription('API documentation for FarmNavigators')
  .setVersion('1.0')
  .addBearerAuth() // Adiciona suporte a Bearer Token
  .build();

// No controller
@ApiBearerAuth() // Indica que precisa de autenticação
@ApiResponse({
  status: 401,
  description: 'Token inválido ou ausente',
  example: {
    statusCode: 401,
    message: 'Unauthorized',
    error: 'Invalid token'
  }
})
```

### 7. Respostas de Erro Padronizadas

```typescript
// Criar um decorator customizado para erros comuns
function ApiCommonResponses() {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: 'Não autorizado',
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Invalid token'
      }
    }),
    ApiResponse({
      status: 403,
      description: 'Acesso negado',
      example: {
        statusCode: 403,
        message: 'Forbidden',
        error: 'Insufficient permissions'
      }
    }),
    ApiResponse({
      status: 500,
      description: 'Erro interno do servidor',
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Database connection failed'
      }
    })
  );
}

// Usar no controller
@Get()
@ApiCommonResponses()
@ApiResponse({
  status: 200,
  description: 'Operação bem-sucedida',
  example: { /* seu exemplo específico */ }
})
async findAll() {
  // implementação...
}
```

### 8. Exemplos com Validação

```typescript
export class CreateAlertDto {
  @ApiProperty({
    description: 'Tipo do alerta',
    enum: AlertType,
    example: 'DROUGHT'
  })
  @IsEnum(AlertType)
  type: AlertType;

  @ApiProperty({
    description: 'Severidade do alerta',
    enum: Severity,
    example: 'HIGH'
  })
  @IsEnum(Severity)
  severity: Severity;

  @ApiProperty({
    description: 'Mensagem do alerta',
    example: 'Seca detectada na região nordeste da fazenda',
    minLength: 10,
    maxLength: 500
  })
  @IsString()
  @Length(10, 500)
  message: string;

  @ApiProperty({
    description: 'ID da fazenda relacionada',
    example: 'cm1k2x3y4z5a6b7c8d9e0f1h'
  })
  @IsString()
  farmId: string;
}
```

### 9. Configuração para Diferentes Ambientes

```typescript
// Adicionar no main.ts
if (process.env.NODE_ENV !== 'production') {
  const config = new DocumentBuilder()
    .setTitle('FarmNavigators API')
    .setDescription('API documentation for FarmNavigators')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:3000/api', 'Development')
    .addServer('https://api.farmnavigators.com/api', 'Production')
    .build();

  const documentation = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentation);
}
```

## 🔗 Links Úteis

- **Swagger Local**: http://localhost:3000/docs
- **Swagger Decorators**: https://docs.nestjs.com/openapi/decorators
- **OpenAPI Specification**: https://swagger.io/specification/