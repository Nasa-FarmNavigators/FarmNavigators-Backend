# Farm Navigators - DTOs para Frontend

Este documento contém todos os DTOs (Data Transfer Objects) do backend Farm Navigators para implementação no frontend.

## 📋 Índice

1. [Authentication DTOs](#authentication-dtos)
2. [User DTOs](#user-dtos)
3. [Organization DTOs](#organization-dtos)
4. [Farm DTOs](#farm-dtos)
5. [Crop Types DTOs](#crop-types-dtos)
6. [Recommendations DTOs](#recommendations-dtos)
7. [Python Integration DTOs](#python-integration-dtos)
8. [Enums](#enums)

---

## 🔐 Authentication DTOs

### RegisterDto

```typescript
interface RegisterDto {
  email?: string; // Email do usuário (opcional)
  phone?: string; // Telefone do usuário (opcional)
  password?: string; // Senha do usuário (opcional para USSD)
  name: string; // Nome completo do usuário
  role?: Role; // Papel do usuário (default: FARMER)
  language?: string; // Idioma preferido (default: "pt")
  timezone?: string; // Fuso horário (default: "Africa/Luanda")
  organizationId?: string; // ID da organização
}
```

### LoginDto

```typescript
interface LoginDto {
  email?: string; // Email do usuário (opcional)
  phone?: string; // Telefone do usuário (opcional)
  password?: string; // Senha do usuário (opcional)
}
```

### AuthResponseDto

```typescript
interface AuthResponseDto {
  access_token: string; // Token JWT
  token_type: string; // Tipo do token ("Bearer")
  expires_in: number; // Tempo de expiração em segundos
  user: {
    id: string;
    email?: string;
    phone?: string;
    name: string;
    role: Role;
    language: string;
    timezone?: string;
  };
}
```

---

## 👥 User DTOs

### CreateUserDto

```typescript
interface CreateUserDto {
  email?: string; // Email do usuário (opcional)
  phone?: string; // Telefone do usuário (opcional)
  password?: string; // Senha do usuário (opcional)
  name: string; // Nome completo
  role?: Role; // Papel do usuário (default: FARMER)
  language?: string; // Idioma preferido (default: "pt")
  timezone?: string; // Fuso horário (default: "Africa/Luanda")
  organizationId?: string; // ID da organização
}
```

### UpdateUserDto

```typescript
interface UpdateUserDto {
  email?: string; // Email do usuário
  phone?: string; // Telefone do usuário
  password?: string; // Nova senha
  name?: string; // Nome completo
  role?: Role; // Papel do usuário
  language?: string; // Idioma preferido
  timezone?: string; // Fuso horário
  organizationId?: string; // ID da organização
}
```

### UserResponseDto

```typescript
interface UserResponseDto {
  id: string; // ID único do usuário (CUID)
  email?: string; // Email do usuário
  phone?: string; // Telefone do usuário
  name: string; // Nome completo do usuário
  role: Role; // Papel do usuário
  language: string; // Idioma preferido
  timezone?: string; // Fuso horário
  organizationId?: string; // ID da organização
  createdAt: Date; // Data de criação
  updatedAt: Date; // Data de última atualização
}
```

---

## 🏢 Organization DTOs

### CreateOrganizationDto

```typescript
interface CreateOrganizationDto {
  name: string; // Nome da organização
  type?: string; // Tipo da organização (NGO, Cooperativa, etc.)
  country?: string; // País da organização
  contactEmail?: string; // Email de contato
}
```

### UpdateOrganizationDto

```typescript
interface UpdateOrganizationDto {
  name?: string; // Nome da organização
  type?: string; // Tipo da organização
  country?: string; // País da organização
  contactEmail?: string; // Email de contato
}
```

### OrganizationResponseDto

```typescript
interface OrganizationResponseDto {
  id: string; // ID da organização (CUID)
  name: string; // Nome da organização
  type?: string; // Tipo da organização
  country?: string; // País da organização
  contactEmail?: string; // Email de contato
  createdAt: Date; // Data de criação
  updatedAt: Date; // Data de última atualização
}
```

---

## 🚜 Farm DTOs

### CreateFarmDto

```typescript
interface CreateFarmDto {
  name: string; // Nome da fazenda
  organizationId?: string; // ID da organização (NGO, cooperativa, etc.)
  province?: string; // Província
  municipality?: string; // Município
  centroidLat: number; // Latitude do centroide da fazenda (-90 a 90)
  centroidLon: number; // Longitude do centroide da fazenda (-180 a 180)
  boundary?: any; // Boundary da fazenda em formato GeoJSON
  areaHa: number; // Área da fazenda em hectares (min: 0.1)
  soilType?: string; // Tipo de solo
}
```

### UpdateFarmDto

```typescript
interface UpdateFarmDto {
  name?: string; // Nome da fazenda
  organizationId?: string; // ID da organização
  province?: string; // Província
  municipality?: string; // Município
  centroidLat?: number; // Latitude do centroide da fazenda
  centroidLon?: number; // Longitude do centroide da fazenda
  boundary?: any; // Boundary da fazenda em formato GeoJSON
  areaHa?: number; // Área da fazenda em hectares
  soilType?: string; // Tipo de solo
}
```

### FarmResponseDto

```typescript
interface FarmResponseDto {
  id: string; // ID único da fazenda (CUID)
  name: string; // Nome da fazenda
  ownerId: string; // ID do proprietário (CUID)
  organizationId?: string; // ID da organização (CUID)
  province?: string; // Província
  municipality?: string; // Município
  centroidLat?: number; // Latitude do centroide da fazenda
  centroidLon?: number; // Longitude do centroide da fazenda
  boundary?: any; // Boundary da fazenda em formato GeoJSON
  areaHa?: number; // Área da fazenda em hectares
  soilType?: string; // Tipo de solo
  createdAt: Date; // Data de criação
  updatedAt: Date; // Data de última atualização
}
```

---

## 🌱 Crop Types DTOs

### CreateCropTypeDto

```typescript
interface CreateCropTypeDto {
  name: string; // Nome do tipo de cultura
  scientificName?: string; // Nome científico
  description?: string; // Descrição
  typicalStartMonth?: number; // Mês típico de início (1-12)
  typicalEndMonth?: number; // Mês típico de fim (1-12)
}
```

### UpdateCropTypeDto

```typescript
interface UpdateCropTypeDto {
  name?: string; // Nome do tipo de cultura
  scientificName?: string; // Nome científico
  description?: string; // Descrição
  typicalStartMonth?: number; // Mês típico de início
  typicalEndMonth?: number; // Mês típico de fim
}
```

### CropTypeResponseDto

```typescript
interface CropTypeResponseDto {
  id: string; // ID do tipo de cultura (CUID)
  name: string; // Nome do tipo de cultura
  scientificName?: string; // Nome científico
  description?: string; // Descrição
  typicalStartMonth?: number; // Mês típico de início
  typicalEndMonth?: number; // Mês típico de fim
  createdAt: Date; // Data de criação
}
```

---

## 💡 Recommendations DTOs

### CreateRecommendationDto

```typescript
interface CreateRecommendationDto {
  fieldId?: string; // ID do field/talhão (CUID)
  farmId?: string; // ID da fazenda (CUID)
  createdBy?: string; // Criado por ("system" ou user id)
  type: string; // Tipo (ex: "PLANTING", "IRRIGATION", "PEST")
  title: string; // Título da recomendação
  body: string; // Corpo da recomendação
  score?: number; // Pontuação da recomendação
  actionSuggested?: any; // Ação sugerida (JSON)
  metadata?: any; // Metadados (JSON)
  isActioned?: boolean; // Se foi executada (default: false)
}
```

### UpdateRecommendationDto

```typescript
interface UpdateRecommendationDto {
  fieldId?: string; // ID do field/talhão
  farmId?: string; // ID da fazenda
  createdBy?: string; // Criado por
  type?: string; // Tipo da recomendação
  title?: string; // Título da recomendação
  body?: string; // Corpo da recomendação
  score?: number; // Pontuação da recomendação
  actionSuggested?: any; // Ação sugerida
  metadata?: any; // Metadados
  isActioned?: boolean; // Se foi executada
}
```

### RecommendationResponseDto

```typescript
interface RecommendationResponseDto {
  id: string; // ID da recomendação (CUID)
  farmId?: string; // ID da fazenda (CUID)
  fieldId?: string; // ID do field/talhão (CUID)
  createdBy?: string; // Criado por
  createdAt: Date; // Data de criação
  type: string; // Tipo da recomendação
  title: string; // Título da recomendação
  body: string; // Corpo da recomendação
  score?: number; // Pontuação da recomendação
  actionSuggested?: any; // Ação sugerida (JSON)
  metadata?: any; // Metadados (JSON)
  isActioned: boolean; // Se foi executada
}
```

---

## 🐍 Python Integration DTOs

### WeatherRequestDto

```typescript
interface WeatherRequestDto {
  latitude: number; // Latitude (-90 a 90)
  longitude: number; // Longitude (-180 a 180)
  startDate: string; // Data de início (YYYY-MM-DD)
  endDate: string; // Data de fim (YYYY-MM-DD)
}
```

### RecommendationRequestDto

```typescript
interface RecommendationRequestDto {
  farmId: string; // ID da fazenda (CUID)
  cropType: string; // Tipo de cultura
  latitude: number; // Latitude
  longitude: number; // Longitude
  soilType?: string; // Tipo de solo
  areaHa?: number; // Área em hectares
}
```

### CropSimulationRequestDto

```typescript
interface CropSimulationRequestDto {
  cropType: string; // Tipo de cultura
  plantingDate: string; // Data de plantio (YYYY-MM-DD)
  latitude: number; // Latitude
  longitude: number; // Longitude
  soilType?: string; // Tipo de solo
  irrigationType?: string; // Tipo de irrigação
}
```

### SatelliteDataRequestDto

```typescript
interface SatelliteDataRequestDto {
  latitude: number; // Latitude
  longitude: number; // Longitude
  startDate: string; // Data de início (YYYY-MM-DD)
  endDate: string; // Data de fim (YYYY-MM-DD)
  bbox?: number[]; // Bounding box [minLon, minLat, maxLon, maxLat]
}
```

### WeatherResponseDto

```typescript
interface WeatherResponseDto {
  latitude: number;
  longitude: number;
  daily: {
    time: string[]; // Array de datas
    temperature_2m_max: number[]; // Temperaturas máximas
    temperature_2m_min: number[]; // Temperaturas mínimas
    precipitation_sum: number[]; // Precipitação total
    windspeed_10m_max: number[]; // Velocidade máxima do vento
  };
}
```

### PythonRecommendationResponseDto

```typescript
interface PythonRecommendationResponseDto {
  farmId: string;
  recommendations: Array<{
    type: string; // Tipo da recomendação
    priority: string; // Prioridade (HIGH, MEDIUM, LOW)
    title: string; // Título
    description: string; // Descrição
    action: string; // Ação recomendada
    confidence: number; // Nível de confiança (0-1)
  }>;
  metadata: {
    analysisDate: string; // Data da análise
    dataSource: string; // Fonte dos dados
    modelVersion: string; // Versão do modelo
  };
}
```

### CropSimulationResponseDto

```typescript
interface CropSimulationResponseDto {
  cropType: string;
  plantingDate: string;
  harvestDate: string; // Data estimada de colheita
  yieldEstimate: number; // Estimativa de produção
  growthStages: Array<{
    stage: string; // Nome do estágio
    startDate: string; // Data de início
    endDate: string; // Data de fim
    description: string; // Descrição do estágio
  }>;
  riskFactors: Array<{
    factor: string; // Fator de risco
    severity: string; // Severidade (LOW, MEDIUM, HIGH)
    mitigation: string; // Estratégia de mitigação
  }>;
}
```

### SatelliteDataResponseDto

```typescript
interface SatelliteDataResponseDto {
  latitude: number;
  longitude: number;
  data: Array<{
    date: string; // Data da observação
    ndvi: number; // Índice de vegetação (-1 a 1)
    evi: number; // Índice de vegetação melhorado
    soilMoisture?: number; // Umidade do solo
    cloudCover: number; // Cobertura de nuvens (0-100)
    imageUrl?: string; // URL da imagem de satélite
  }>;
  metadata: {
    satellite: string; // Nome do satélite
    resolution: string; // Resolução dos dados
    processingDate: string; // Data de processamento
  };
}
```

---

## 📊 Enums

### Role

```typescript
enum Role {
  FARMER = 'FARMER',
  TECHNICIAN = 'TECHNICIAN',
  NGO = 'NGO',
  GOVERNMENT = 'GOVERNMENT',
  ADMIN = 'ADMIN',
}
```

### PlantingStatus

```typescript
enum PlantingStatus {
  PLANTED = 'PLANTED',
  HARVESTED = 'HARVESTED',
  CANCELLED = 'CANCELLED',
}
```

### NotificationStatus

```typescript
enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  READ = 'READ',
}
```

### Channel

```typescript
enum Channel {
  PUSH = 'PUSH',
  USSD = 'USSD',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
}
```

### DevicePlatform

```typescript
enum DevicePlatform {
  ANDROID = 'ANDROID',
  IOS = 'IOS',
  WEB = 'WEB',
}
```

### AlertType

```typescript
enum AlertType {
  FIRE = 'FIRE',
  DROUGHT = 'DROUGHT',
  FLOOD = 'FLOOD',
  PEST = 'PEST',
  OTHER = 'OTHER',
}
```

### Severity

```typescript
enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}
```

---

## 🔄 API Response Pattern

Todas as respostas da API seguem este padrão:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
```

### Exemplo de uso:

```typescript
interface LoginResponse extends ApiResponse<AuthResponseDto> {}
interface UsersListResponse extends ApiResponse<UserResponseDto[]> {}
interface FarmResponse extends ApiResponse<FarmResponseDto> {}
```

---

## 🛠️ Notas de Implementação

1. **IDs**: Todos os IDs são strings (CUID) ao invés de números
2. **Datas**: Use format ISO 8601 para datas (`YYYY-MM-DDTHH:mm:ss.sssZ`)
3. **Coordenadas**: Latitude (-90 a 90), Longitude (-180 a 180)
4. **Validação**: Implemente validação client-side baseada nas regras dos DTOs
5. **Tipos Opcionais**: Campos marcados com `?` são opcionais
6. **Enums**: Use os valores exatos dos enums para compatibilidade

---

## 📚 Endpoints Principais

- **Auth**: `/api/auth/*`
- **Users**: `/api/users/*` e `/api/admin/users/*`
- **Organizations**: `/api/organizations/*`
- **Farms**: `/api/farms/*`
- **Crop Types**: `/api/crop-types/*`
- **Recommendations**: `/api/recommendations/*`
- **Python Integration**: `/api/python/*`

---

_Gerado em: October 3, 2025_  
_Backend Version: Farm Navigators v1.0.0_
