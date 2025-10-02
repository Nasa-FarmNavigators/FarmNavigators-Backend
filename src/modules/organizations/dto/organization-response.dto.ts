import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrganizationResponseDto {
  @ApiProperty({
    description: 'ID da organização',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nome da organização',
    example: 'Cooperativa São João',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Tipo da organização',
    example: 'Cooperativa',
  })
  type?: string;

  @ApiPropertyOptional({
    description: 'País da organização',
    example: 'Angola',
  })
  country?: string;

  @ApiPropertyOptional({
    description: 'Email de contato',
    example: 'contato@cooperativasaojoao.ao',
  })
  contactEmail?: string;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Estatísticas da organização',
  })
  _count?: {
    users: number;
    farms: number;
  };
}
