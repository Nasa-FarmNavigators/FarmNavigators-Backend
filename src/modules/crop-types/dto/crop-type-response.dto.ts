import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CropTypeResponseDto {
  @ApiProperty({
    description: 'ID do tipo de cultura',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nome da cultura',
    example: 'Milho',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Nome científico da cultura',
    example: 'Zea mays',
  })
  scientificName?: string;

  @ApiPropertyOptional({
    description: 'Descrição da cultura',
    example: 'Cereal amplamente cultivado em Angola',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Mês típico de início do plantio (1-12)',
    example: 10,
  })
  typicalStartMonth?: number;

  @ApiPropertyOptional({
    description: 'Mês típico de fim do ciclo (1-12)',
    example: 4,
  })
  typicalEndMonth?: number;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Número de plantios usando esta cultura',
  })
  _count?: {
    plantings: number;
  };
}
