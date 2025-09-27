import { ApiProperty } from '@nestjs/swagger';

export class FarmResponseDto {
  @ApiProperty({
    description: 'ID único da fazenda',
    example: 'cm1k2x3y4z5a6b7c8d9e0f1h',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da fazenda',
    example: 'Fazenda São João',
  })
  name: string;

  @ApiProperty({
    description: 'Latitude da fazenda',
    example: -15.7942,
  })
  latitude: number;

  @ApiProperty({
    description: 'Longitude da fazenda',
    example: -47.8822,
  })
  longitude: number;

  @ApiProperty({
    description: 'Área da fazenda em hectares',
    example: 150.5,
  })
  area: number;

  @ApiProperty({
    description: 'Tipo de cultura plantada',
    example: 'Soja',
  })
  cropType: string;

  @ApiProperty({
    description: 'ID do proprietário',
    example: 'cm1k2x3y4z5a6b7c8d9e0f1g',
  })
  ownerId: string;

  @ApiProperty({
    description: 'Dados do proprietário',
    example: {
      id: 'cm1k2x3y4z5a6b7c8d9e0f1g',
      name: 'João Silva',
      email: 'joao@fazenda.com',
    },
  })
  owner?: {
    id: string;
    name: string;
    email: string;
  };

  @ApiProperty({
    description: 'Data de criação',
    example: '2025-09-23T16:00:10.123Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de última atualização',
    example: '2025-09-23T16:30:10.123Z',
  })
  updatedAt: Date;
}
