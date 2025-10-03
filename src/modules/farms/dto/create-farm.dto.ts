import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  MinLength,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class CreateFarmDto {
  @ApiProperty({
    description: 'Nome da fazenda',
    example: 'Fazenda São João',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name: string;

  @ApiPropertyOptional({
    description: 'ID da organização (NGO, cooperativa, etc.)',
    example: 'clxyz123abc456def789',
  })
  @IsOptional()
  @IsString({ message: 'ID da organização deve ser uma string' })
  organizationId?: string;

  @ApiPropertyOptional({
    description: 'Província',
    example: 'Luanda',
  })
  @IsOptional()
  @IsString({ message: 'Província deve ser uma string' })
  province?: string;

  @ApiPropertyOptional({
    description: 'Município',
    example: 'Viana',
  })
  @IsOptional()
  @IsString({ message: 'Município deve ser uma string' })
  municipality?: string;

  @ApiProperty({
    description: 'Latitude do centroide da fazenda',
    example: -15.7942,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber({}, { message: 'Latitude deve ser um número' })
  @Min(-90, { message: 'Latitude deve estar entre -90 e 90' })
  @Max(90, { message: 'Latitude deve estar entre -90 e 90' })
  centroidLat: number;

  @ApiProperty({
    description: 'Longitude do centroide da fazenda',
    example: -47.8822,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber({}, { message: 'Longitude deve ser um número' })
  @Min(-180, { message: 'Longitude deve estar entre -180 e 180' })
  @Max(180, { message: 'Longitude deve estar entre -180 e 180' })
  centroidLon: number;

  @ApiPropertyOptional({
    description: 'Boundary da fazenda em formato GeoJSON',
    example: {
      type: 'Polygon',
      coordinates: [
        [
          [-47.8822, -15.7942],
          [-47.8822, -15.7943],
          [-47.8821, -15.7943],
          [-47.8821, -15.7942],
          [-47.8822, -15.7942],
        ],
      ],
    },
  })
  @IsOptional()
  boundary?: any;

  @ApiProperty({
    description: 'Área da fazenda em hectares',
    example: 150.5,
    minimum: 0.1,
  })
  @IsNumber({}, { message: 'Área deve ser um número' })
  @Min(0.1, { message: 'Área deve ser maior que 0' })
  areaHa: number;

  @ApiPropertyOptional({
    description: 'Tipo de solo',
    example: 'Argiloso',
  })
  @IsOptional()
  @IsString({ message: 'Tipo de solo deve ser uma string' })
  soilType?: string;
}
