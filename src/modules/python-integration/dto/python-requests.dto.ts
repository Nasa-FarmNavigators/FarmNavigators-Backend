import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsInt,
  IsDateString,
  IsArray,
} from 'class-validator';

export class WeatherRequestDto {
  @ApiProperty({
    description: 'Latitude da localização',
    example: -15.7942,
  })
  @IsNumber({}, { message: 'Latitude deve ser um número' })
  lat: number;

  @ApiProperty({
    description: 'Longitude da localização',
    example: -47.8822,
  })
  @IsNumber({}, { message: 'Longitude deve ser um número' })
  lon: number;

  @ApiPropertyOptional({
    description: 'Data de início (ISO string)',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data de fim (ISO string)',
    example: '2024-01-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  endDate?: string;
}

export class RecommendationRequestDto {
  @ApiProperty({
    description: 'ID da fazenda',
    example: 1,
  })
  @IsInt({ message: 'Farm ID deve ser um número inteiro' })
  farmId: number;

  @ApiPropertyOptional({
    description: 'ID do field específico (opcional)',
    example: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Field ID deve ser um número inteiro' })
  fieldId?: number;

  @ApiPropertyOptional({
    description: 'Tipo de recomendação solicitada',
    example: 'PLANTING',
  })
  @IsOptional()
  type?: string;
}

export class CropSimulationRequestDto {
  @ApiProperty({
    description: 'ID da fazenda',
    example: 1,
  })
  @IsInt({ message: 'Farm ID deve ser um número inteiro' })
  farmId: number;

  @ApiProperty({
    description: 'ID do tipo de cultura',
    example: 1,
  })
  @IsInt({ message: 'Crop Type ID deve ser um número inteiro' })
  cropTypeId: number;

  @ApiPropertyOptional({
    description: 'Área plantada em hectares',
    example: 10.5,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Área deve ser um número' })
  areaHa?: number;

  @ApiPropertyOptional({
    description: 'Data de plantio planejada',
    example: '2024-10-15T00:00:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de plantio deve ser uma data válida' })
  plantingDate?: string;
}

export class SatelliteDataRequestDto {
  @ApiProperty({
    description: 'Latitude da área de interesse',
    example: -15.7942,
  })
  @IsNumber({}, { message: 'Latitude deve ser um número' })
  lat: number;

  @ApiProperty({
    description: 'Longitude da área de interesse',
    example: -47.8822,
  })
  @IsNumber({}, { message: 'Longitude deve ser um número' })
  lon: number;

  @ApiPropertyOptional({
    description: 'Raio da área em metros',
    example: 1000,
  })
  @IsOptional()
  @IsInt({ message: 'Raio deve ser um número inteiro' })
  radiusMeters?: number;

  @ApiPropertyOptional({
    description: 'Data de início para busca',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Data de fim para busca',
    example: '2024-01-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Métricas desejadas',
    example: ['ndvi', 'evi', 'soil_moisture'],
  })
  @IsOptional()
  @IsArray({ message: 'Métricas deve ser um array' })
  metrics?: string[];
}
