import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@fazenda.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Telefone do usuário',
    example: '+244923456789',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Papel do usuário',
    enum: Role,
    example: 'FARMER',
  })
  role: Role;

  @ApiProperty({
    description: 'Idioma preferido',
    example: 'pt',
  })
  language: string;

  @ApiProperty({
    description: 'Fuso horário',
    example: 'Africa/Luanda',
    required: false,
  })
  timezone?: string;

  @ApiProperty({
    description: 'ID da organização',
    example: 1,
    required: false,
  })
  organizationId?: number;

  @ApiProperty({
    description: 'Data de criação',
    example: '2025-09-23T14:56:10.123Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de última atualização',
    example: '2025-09-23T14:56:10.123Z',
  })
  updatedAt: Date;
}
