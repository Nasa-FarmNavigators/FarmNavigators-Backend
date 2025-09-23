import { Controller, Get, Post, Body, Response } from "@nestjs/common";
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse,
  ApiProperty
} from "@nestjs/swagger";

export class HealthResponseDto {
  @ApiProperty({ example: true, description: 'Status da operação' })
  success: boolean;
  
  @ApiProperty({ example: 'FarmNavigators API is running', description: 'Mensagem de status' })
  message: string;
  
  @ApiProperty({ example: '2025-09-23T14:56:10.123Z', description: 'Timestamp da resposta' })
  timestamp: string;
  
  @ApiProperty({ example: '1.0.0', description: 'Versão da API' })
  version: string;
}

@ApiTags('Health Check')
@Controller('health')
export class AppController {

    @Get()
    @ApiOperation({ 
      summary: 'Verificar saúde da API',
      description: 'Endpoint para verificar se a API está funcionando corretamente'
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
          version: '1.0.0'
        }
      }
    })
    @ApiResponse({
      status: 500,
      description: 'Erro interno do servidor',
      schema: {
        example: {
          success: false,
          message: 'Internal server error',
          timestamp: '2025-09-23T14:56:10.123Z',
          error: 'Database connection failed'
        }
      }
    })
    getHealth(@Response() res) {
        return res.status(200).json({
            success: true,
            message: 'FarmNavigators API is running',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
        });
    }
}