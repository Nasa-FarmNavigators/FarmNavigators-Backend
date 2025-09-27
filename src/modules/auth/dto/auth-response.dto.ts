import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token de acesso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Tipo do token',
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description: 'Tempo de expiração em segundos',
    example: 604800,
  })
  expires_in: number;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
    example: {
      id: 'cm1k2x3y4z5a6b7c8d9e0f1g',
      email: 'joao@fazenda.com',
      name: 'João Silva',
      role: 'FARMER',
    },
  })
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
  };
}
