import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, MinLength, Min, Max } from 'class-validator';

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

  @ApiProperty({
    description: 'Latitude da fazenda',
    example: -15.7942,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber({}, { message: 'Latitude deve ser um número' })
  @Min(-90, { message: 'Latitude deve estar entre -90 e 90' })
  @Max(90, { message: 'Latitude deve estar entre -90 e 90' })
  latitude: number;

  @ApiProperty({
    description: 'Longitude da fazenda',
    example: -47.8822,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber({}, { message: 'Longitude deve ser um número' })
  @Min(-180, { message: 'Longitude deve estar entre -180 e 180' })
  @Max(180, { message: 'Longitude deve estar entre -180 e 180' })
  longitude: number;

  @ApiProperty({
    description: 'Área da fazenda em hectares',
    example: 150.5,
    minimum: 0.1,
  })
  @IsNumber({}, { message: 'Área deve ser um número' })
  @Min(0.1, { message: 'Área deve ser maior que 0' })
  area: number;

  @ApiProperty({
    description: 'Tipo de cultura plantada',
    example: 'Soja',
    minLength: 2,
  })
  @IsString({ message: 'Tipo de cultura deve ser uma string' })
  @MinLength(2, { message: 'Tipo de cultura deve ter pelo menos 2 caracteres' })
  cropType: string;
}
