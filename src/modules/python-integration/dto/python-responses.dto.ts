import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WeatherResponseDto {
  @ApiProperty({
    description: 'Status da resposta',
    example: 'success',
  })
  status: string;

  @ApiProperty({
    description: 'Dados meteorológicos',
    example: {
      current: {
        temperature: 25.5,
        humidity: 65,
        precipitation: 0,
        windSpeed: 10.2,
      },
      forecast: [
        {
          date: '2024-01-16',
          temperature_max: 30,
          temperature_min: 20,
          precipitation: 15.5,
          humidity: 70,
        },
      ],
    },
  })
  data: any;

  @ApiPropertyOptional({
    description: 'Fonte dos dados',
    example: 'NASA Giovanni',
  })
  source?: string;

  @ApiPropertyOptional({
    description: 'Timestamp da consulta',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp?: string;
}

export class PythonRecommendationResponseDto {
  @ApiProperty({
    description: 'Status da resposta',
    example: 'success',
  })
  status: string;

  @ApiProperty({
    description: 'Lista de recomendações',
    example: [
      {
        type: 'PLANTING',
        cropName: 'Milho',
        confidence: 0.85,
        yield_estimate: 4500,
        recommendations: [
          'Plantar entre outubro e novembro',
          'Usar variedade resistente à seca',
        ],
      },
    ],
  })
  recommendations: any[];

  @ApiPropertyOptional({
    description: 'Metadados do modelo ML',
    example: {
      model_version: '1.2.0',
      last_trained: '2024-01-01',
      confidence_threshold: 0.7,
    },
  })
  metadata?: any;
}

export class CropSimulationResponseDto {
  @ApiProperty({
    description: 'Status da resposta',
    example: 'success',
  })
  status: string;

  @ApiProperty({
    description: 'Resultados da simulação',
    example: {
      crop: 'Milho',
      estimated_yield: 4500,
      growth_stages: [
        {
          stage: 'Germinação',
          days: 7,
          description: 'Emergência das plantas',
        },
        {
          stage: 'Crescimento vegetativo',
          days: 45,
          description: 'Desenvolvimento de folhas e caule',
        },
      ],
      risks: [
        {
          type: 'drought',
          probability: 0.3,
          impact: 'medium',
          mitigation: 'Sistema de irrigação',
        },
      ],
    },
  })
  simulation: any;

  @ApiPropertyOptional({
    description: 'Condições utilizadas na simulação',
  })
  conditions?: any;
}

export class SatelliteDataResponseDto {
  @ApiProperty({
    description: 'Status da resposta',
    example: 'success',
  })
  status: string;

  @ApiProperty({
    description: 'Dados de satélite processados',
    example: {
      ndvi: {
        current: 0.75,
        trend: 'increasing',
        historical_avg: 0.65,
      },
      soil_moisture: {
        current: 0.45,
        status: 'adequate',
      },
    },
  })
  data: any;

  @ApiPropertyOptional({
    description: 'URLs para imagens/dados brutos',
    example: ['https://satellite-data.com/image1.tiff'],
  })
  raw_urls?: string[];

  @ApiPropertyOptional({
    description: 'Fonte dos dados de satélite',
    example: 'MODIS/Terra',
  })
  source?: string;
}
