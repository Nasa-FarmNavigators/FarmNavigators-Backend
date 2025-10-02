import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MinLength,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateCropTypeDto {
  @ApiProperty({
    description: 'Nome da cultura',
    example: 'Milho',
    minLength: 2,
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name: string;

  @ApiPropertyOptional({
    description: 'Nome científico da cultura',
    example: 'Zea mays',
  })
  @IsOptional()
  @IsString({ message: 'Nome científico deve ser uma string' })
  scientificName?: string;

  @ApiPropertyOptional({
    description: 'Descrição da cultura',
    example: 'Cereal amplamente cultivado em Angola',
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Mês típico de início do plantio (1-12)',
    example: 10,
    minimum: 1,
    maximum: 12,
  })
  @IsOptional()
  @IsInt({ message: 'Mês de início deve ser um número inteiro' })
  @Min(1, { message: 'Mês deve estar entre 1 e 12' })
  @Max(12, { message: 'Mês deve estar entre 1 e 12' })
  typicalStartMonth?: number;

  @ApiPropertyOptional({
    description: 'Mês típico de fim do ciclo (1-12)',
    example: 4,
    minimum: 1,
    maximum: 12,
  })
  @IsOptional()
  @IsInt({ message: 'Mês de fim deve ser um número inteiro' })
  @Min(1, { message: 'Mês deve estar entre 1 e 12' })
  @Max(12, { message: 'Mês deve estar entre 1 e 12' })
  typicalEndMonth?: number;
}
