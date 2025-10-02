import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class CreateRecommendationDto {
  @ApiPropertyOptional({
    description: 'ID da fazenda (se aplicável)',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Farm ID deve ser um número inteiro' })
  farmId?: number;

  @ApiPropertyOptional({
    description: 'ID do field/talhão (se aplicável)',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Field ID deve ser um número inteiro' })
  fieldId?: number;

  @ApiPropertyOptional({
    description: 'Quem/o que criou a recomendação',
    example: 'system',
  })
  @IsOptional()
  @IsString({ message: 'CreatedBy deve ser uma string' })
  createdBy?: string;

  @ApiProperty({
    description: 'Tipo da recomendação',
    example: 'PLANTING',
    enum: ['PLANTING', 'IRRIGATION', 'PEST', 'FERTILIZER', 'HARVEST', 'OTHER'],
  })
  @IsString({ message: 'Tipo deve ser uma string' })
  type: string;

  @ApiProperty({
    description: 'Título da recomendação',
    example: 'Recomendação de Plantio - Milho',
  })
  @IsString({ message: 'Título deve ser uma string' })
  title: string;

  @ApiProperty({
    description: 'Corpo/descrição da recomendação',
    example:
      'Baseado nas condições climáticas, recomendamos o plantio de milho neste período.',
  })
  @IsString({ message: 'Corpo deve ser uma string' })
  body: string;

  @ApiPropertyOptional({
    description: 'Score/confiança da recomendação (0-1)',
    example: 0.85,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Score deve ser um número' })
  @Min(0, { message: 'Score deve estar entre 0 e 1' })
  @Max(1, { message: 'Score deve estar entre 0 e 1' })
  score?: number;

  @ApiPropertyOptional({
    description: 'Ações sugeridas (formato JSON)',
    example: {
      steps: ['Preparar o solo', 'Plantar as sementes', 'Irrigar regularmente'],
      estimatedCost: 500,
      estimatedDuration: '3 meses',
    },
  })
  @IsOptional()
  actionSuggested?: any;

  @ApiPropertyOptional({
    description: 'Metadados adicionais (formato JSON)',
    example: {
      source: 'ml_model_v1.2',
      confidence: 0.85,
      weather_data_used: true,
    },
  })
  @IsOptional()
  metadata?: any;

  @ApiPropertyOptional({
    description: 'Se a recomendação foi seguida pelo agricultor',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'IsActioned deve ser um boolean' })
  isActioned?: boolean;
}
