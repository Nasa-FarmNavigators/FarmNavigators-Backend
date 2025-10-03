import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FarmResponseDto {
  @ApiProperty({
    description: 'ID único da fazenda',
    example: 'clxyz123abc456def789',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da fazenda',
    example: 'Fazenda São João',
  })
  name: string;

  @ApiProperty({
    description: 'ID do proprietário',
    example: 'clxyz123abc456def789',
  })
  ownerId: string;

  @ApiPropertyOptional({
    description: 'ID da organização',
    example: 'clxyz123abc456def789',
  })
  organizationId?: string;

  @ApiPropertyOptional({
    description: 'Província',
    example: 'Luanda',
  })
  province?: string;

  @ApiPropertyOptional({
    description: 'Município',
    example: 'Viana',
  })
  municipality?: string;

  @ApiPropertyOptional({
    description: 'Latitude do centroide',
    example: -15.7942,
  })
  centroidLat?: number;

  @ApiPropertyOptional({
    description: 'Longitude do centroide',
    example: -47.8822,
  })
  centroidLon?: number;

  @ApiPropertyOptional({
    description: 'Boundary GeoJSON',
    example: {
      type: 'Polygon',
      coordinates: [
        [
          [-47.8822, -15.7942],
          [-47.8822, -15.7943],
          [-47.8821, -15.7943],
          [-47.8821, -15.7942],
          [-47.8822, -15.7942],
        ],
      ],
    },
  })
  boundary?: any;

  @ApiPropertyOptional({
    description: 'Área em hectares',
    example: 150.5,
  })
  areaHa?: number;

  @ApiPropertyOptional({
    description: 'Tipo de solo',
    example: 'Argiloso',
  })
  soilType?: string;

  @ApiProperty({
    description: 'Dados do proprietário',
    example: {
      id: 1,
      name: 'João Silva',
      email: 'joao@fazenda.com',
      role: 'FARMER',
    },
  })
  owner?: {
    id: number;
    name: string;
    email?: string;
    role: string;
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
