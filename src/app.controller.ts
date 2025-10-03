import { Controller, Get, Post, Body, Response } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { PrismaService } from './common/prisma.service';

export class HealthResponseDto {
  @ApiProperty({ example: true, description: 'Status da operação' })
  success: boolean;

  @ApiProperty({
    example: 'FarmNavigators API is running',
    description: 'Mensagem de status',
  })
  message: string;

  @ApiProperty({
    example: '2025-09-23T14:56:10.123Z',
    description: 'Timestamp da resposta',
  })
  timestamp: string;

  @ApiProperty({ example: '1.0.0', description: 'Versão da API' })
  version: string;
}

export class DatabaseHealthResponseDto {
  @ApiProperty({ example: true, description: 'Status da operação' })
  success: boolean;

  @ApiProperty({
    example: 'Database connection successful',
    description: 'Mensagem de status',
  })
  message: string;

  @ApiProperty({
    example: '2025-10-03T14:56:10.123Z',
    description: 'Timestamp da resposta',
  })
  timestamp: string;

  @ApiProperty({ example: 'PostgreSQL', description: 'Tipo do banco de dados' })
  database: string;

  @ApiProperty({ example: 'connected', description: 'Status da conexão' })
  status: string;
}

@ApiTags('Health Check')
@Controller('health')
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({
    summary: 'Verificar saúde da API',
    description:
      'Endpoint para verificar se a API está funcionando corretamente',
  })
  @ApiResponse({
    status: 200,
    description: 'API funcionando normalmente',
    type: HealthResponseDto,
    schema: {
      example: {
        success: true,
        message: 'FarmNavigators API is running',
        timestamp: '2025-09-23T14:56:10.123Z',
        version: '1.0.0',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
    schema: {
      example: {
        success: false,
        message: 'Internal server error',
        timestamp: '2025-09-23T14:56:10.123Z',
        error: 'Database connection failed',
      },
    },
  })
  getHealth(@Response() res) {
    return res.status(200).json({
      success: true,
      message: 'FarmNavigators API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  }

  @Get('database')
  @ApiOperation({
    summary: 'Verificar conectividade com banco de dados',
    description:
      'Endpoint para verificar se a conexão com o banco de dados PostgreSQL está funcionando',
  })
  @ApiResponse({
    status: 200,
    description: 'Conexão com banco de dados funcionando normalmente',
    type: DatabaseHealthResponseDto,
    schema: {
      example: {
        success: true,
        message: 'Database connection successful',
        timestamp: '2025-10-03T14:56:10.123Z',
        database: 'PostgreSQL',
        status: 'connected',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Erro de conexão com banco de dados',
    schema: {
      example: {
        success: false,
        message: 'Database connection failed',
        timestamp: '2025-10-03T14:56:10.123Z',
        database: 'PostgreSQL',
        status: 'disconnected',
        error: 'Connection timeout',
      },
    },
  })
  async getDatabaseHealth(@Response() res) {
    try {
      // Tenta executar uma query simples para testar a conexão
      await this.prisma.$queryRaw`SELECT 1`;

      return res.status(200).json({
        success: true,
        message: 'Database connection successful',
        timestamp: new Date().toISOString(),
        database: 'PostgreSQL',
        status: 'connected',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
        timestamp: new Date().toISOString(),
        database: 'PostgreSQL',
        status: 'disconnected',
        error: error.message,
      });
    }
  }
}
