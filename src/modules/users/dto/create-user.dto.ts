import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@fazenda.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'MinhaSenh@123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

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
}
