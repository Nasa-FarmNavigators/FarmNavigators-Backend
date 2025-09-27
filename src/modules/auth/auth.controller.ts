import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar novo usuário',
    description:
      'Cria uma nova conta de usuário e retorna o token de autenticação',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
    type: AuthResponseDto,
    example: {
      success: true,
      message: 'Usuário registrado com sucesso',
      data: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        token_type: 'Bearer',
        expires_in: 604800,
        user: {
          id: 'cm1k2x3y4z5a6b7c8d9e0f1g',
          email: 'joao@fazenda.com',
          name: 'João Silva',
          role: 'FARMER',
        },
      },
      timestamp: '2025-09-27T21:30:10.123Z',
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email já está em uso',
    example: {
      statusCode: 409,
      message: 'Email já está em uso',
      error: 'Conflict',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    example: {
      statusCode: 400,
      message: [
        'Email deve ter um formato válido',
        'Senha deve ter pelo menos 8 caracteres',
        'Nome deve ter pelo menos 2 caracteres',
      ],
      error: 'Bad Request',
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      success: true,
      message: 'Usuário registrado com sucesso',
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Fazer login',
    description: 'Autentica o usuário e retorna o token de acesso',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: AuthResponseDto,
    example: {
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        token_type: 'Bearer',
        expires_in: 604800,
        user: {
          id: 'cm1k2x3y4z5a6b7c8d9e0f1g',
          email: 'joao@fazenda.com',
          name: 'João Silva',
          role: 'FARMER',
        },
      },
      timestamp: '2025-09-27T21:30:10.123Z',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
    example: {
      statusCode: 401,
      message: 'Credenciais inválidas',
      error: 'Unauthorized',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    example: {
      statusCode: 400,
      message: [
        'Email deve ter um formato válido',
        'Senha deve ter pelo menos 8 caracteres',
      ],
      error: 'Bad Request',
    },
  })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      success: true,
      message: 'Login realizado com sucesso',
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter perfil do usuário',
    description: 'Retorna os dados do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário encontrado',
    example: {
      success: true,
      message: 'Perfil encontrado',
      data: {
        id: 'cm1k2x3y4z5a6b7c8d9e0f1g',
        email: 'joao@fazenda.com',
        name: 'João Silva',
        role: 'FARMER',
        createdAt: '2025-09-23T14:56:10.123Z',
        updatedAt: '2025-09-23T14:56:10.123Z',
        farms: [
          {
            id: 'cm1k2x3y4z5a6b7c8d9e0f1h',
            name: 'Fazenda São João',
            latitude: -15.7942,
            longitude: -47.8822,
            area: 150.5,
            cropType: 'Soja',
            createdAt: '2025-09-23T16:00:10.123Z',
          },
        ],
      },
      timestamp: '2025-09-27T21:30:10.123Z',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou ausente',
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Token inválido',
    },
  })
  async getProfile(@Request() req) {
    const profile = await this.authService.getProfile(req.user.id);
    return {
      success: true,
      message: 'Perfil encontrado',
      data: profile,
      timestamp: new Date().toISOString(),
    };
  }
}
