import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RecommendationResponseDto {
  @ApiProperty({
    description: 'ID da recomendação',
    example: 1,
  })
  id: number;

  @ApiPropertyOptional({
    description: 'ID da fazenda',
    example: 1,
  })
  farmId?: number;

  @ApiPropertyOptional({
    description: 'ID do field/talhão',
    example: 1,
  })
  fieldId?: number;

  @ApiPropertyOptional({
    description: 'Quem criou a recomendação',
    example: 'system',
  })
  createdBy?: string;

  @ApiProperty({
    description: 'Tipo da recomendação',
    example: 'PLANTING',
  })
  type: string;

  @ApiProperty({
    description: 'Título da recomendação',
    example: 'Recomendação de Plantio - Milho',
  })
  title: string;

  @ApiProperty({
    description: 'Corpo/descrição da recomendação',
    example:
      'Baseado nas condições climáticas, recomendamos o plantio de milho neste período.',
  })
  body: string;

  @ApiPropertyOptional({
    description: 'Score/confiança da recomendação',
    example: 0.85,
  })
  score?: number;

  @ApiPropertyOptional({
    description: 'Ações sugeridas (formato JSON)',
  })
  actionSuggested?: any;

  @ApiPropertyOptional({
    description: 'Metadados adicionais (formato JSON)',
  })
  metadata?: any;

  @ApiProperty({
    description: 'Se a recomendação foi seguida',
    example: false,
  })
  isActioned: boolean;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Dados da fazenda (se aplicável)',
  })
  farm?: {
    id: number;
    name: string;
    centroidLat?: number;
    centroidLon?: number;
  };

  @ApiPropertyOptional({
    description: 'Dados do field/talhão (se aplicável)',
  })
  field?: {
    id: number;
    name?: string;
    areaHa?: number;
  };
}
