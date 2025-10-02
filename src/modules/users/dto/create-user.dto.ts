import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsInt,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@fazenda.com',
    format: 'email',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '+244923456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'MinhaSenh@123',
    minLength: 8,
    required: false,
  })
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'Nome completo',
    example: 'João da Silva',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: 'Papel do usuário',
    enum: Role,
    example: 'FARMER',
    required: false,
  })
  @IsEnum(Role)
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
