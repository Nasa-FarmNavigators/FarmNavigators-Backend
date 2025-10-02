import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Nome da organização',
    example: 'Cooperativa São João',
    minLength: 2,
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name: string;

  @ApiPropertyOptional({
    description: 'Tipo da organização',
    example: 'Cooperativa',
  })
  @IsOptional()
  @IsString({ message: 'Tipo deve ser uma string' })
  type?: string;

  @ApiPropertyOptional({
    description: 'País da organização',
    example: 'Angola',
  })
  @IsOptional()
  @IsString({ message: 'País deve ser uma string' })
  country?: string;

  @ApiPropertyOptional({
    description: 'Email de contato',
    example: 'contato@cooperativasaojoao.ao',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  contactEmail?: string;
}
