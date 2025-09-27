import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 'cm1k2x3y4z5a6b7c8d9e0f1g',
  })
  id: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@fazenda.com',
  })
  email: string;

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
