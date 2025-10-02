import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsInt,
} from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@fazenda.com',
    required: false,
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '+244923456789',
    required: false,
  })
  @IsString({ message: 'Telefone deve ser uma string' })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'MinhaSenh@123',
    minLength: 8,
    required: false,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    enum: Role,
    example: 'FARMER',
    required: false,
  })
  @IsEnum(Role, {
    message: 'Role deve ser FARMER, TECHNICIAN, NGO, GOVERNMENT ou ADMIN',
  })
  @IsOptional()
  role?: Role;

  @ApiProperty({
    description: 'Idioma preferido',
    example: 'pt',
    required: false,
  })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({
    description: 'Fuso horário',
    example: 'Africa/Luanda',
    required: false,
  })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({
    description: 'ID da organização',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  organizationId?: number;
}
