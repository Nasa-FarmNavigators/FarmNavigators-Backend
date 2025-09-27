import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Criar novo usuário',
    description: 'Cria um novo usuário no sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: UserResponseDto,
    example: {
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        id: 'cm1k2x3y4z5a6b7c8d9e0f1g',
        email: 'joao@fazenda.com',
        name: 'João Silva',
        role: 'FARMER',
        createdAt: '2025-09-23T14:56:10.123Z',
        updatedAt: '2025-09-23T14:56:10.123Z',
      },
      timestamp: '2025-09-23T14:56:10.123Z',
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
        'email must be an email',
        'password must be longer than or equal to 8 characters',
        'name must be longer than or equal to 2 characters',
      ],
      error: 'Bad Request',
    },
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      success: true,
      message: 'Usuário criado com sucesso',
      data: user,
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar todos os usuários (ADMIN apenas)',
    description:
      'Retorna uma lista com todos os usuários do sistema - Restrito a administradores',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários encontrada',
    example: {
      success: true,
      message: 'Usuários encontrados',
      data: [
        {
          id: 'cm1k2x3y4z5a6b7c8d9e0f1g',
          email: 'joao@fazenda.com',
          name: 'João Silva',
          role: 'FARMER',
          createdAt: '2025-09-23T14:56:10.123Z',
          updatedAt: '2025-09-23T14:56:10.123Z',
        },
        {
          id: 'cm1k2x3y4z5a6b7c8d9e0f1h',
          email: 'maria@admin.com',
          name: 'Maria Admin',
          role: 'ADMIN',
          createdAt: '2025-09-23T15:20:10.123Z',
          updatedAt: '2025-09-23T15:20:10.123Z',
        },
      ],
      meta: {
        total: 2,
      },
      timestamp: '2025-09-23T14:56:10.123Z',
    },
  })
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      success: true,
      message: 'Usuários encontrados',
      data: users,
      meta: {
        total: users.length,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Buscar usuário por ID (ADMIN apenas)',
    description:
      'Retorna os dados completos de um usuário específico, incluindo suas fazendas - Restrito a administradores',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário',
    example: 'cm1k2x3y4z5a6b7c8d9e0f1g',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    example: {
      success: true,
      message: 'Usuário encontrado',
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
      timestamp: '2025-09-23T14:56:10.123Z',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    example: {
      statusCode: 404,
      message: 'Usuário não encontrado',
      error: 'Not Found',
    },
  })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return {
      success: true,
      message: 'Usuário encontrado',
      data: user,
      timestamp: new Date().toISOString(),
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar usuário (ADMIN apenas)',
    description:
      'Atualiza os dados de um usuário existente - Restrito a administradores',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário',
    example: 'cm1k2x3y4z5a6b7c8d9e0f1g',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    example: {
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: {
        id: 'cm1k2x3y4z5a6b7c8d9e0f1g',
        email: 'joao@fazenda.com',
        name: 'João Silva Santos',
        role: 'FARMER',
        createdAt: '2025-09-23T14:56:10.123Z',
        updatedAt: '2025-09-23T16:30:10.123Z',
      },
      timestamp: '2025-09-23T16:30:10.123Z',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    example: {
      statusCode: 404,
      message: 'Usuário não encontrado',
      error: 'Not Found',
    },
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: user,
      timestamp: new Date().toISOString(),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remover usuário (ADMIN apenas)',
    description: 'Remove um usuário do sistema - Restrito a administradores',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário',
    example: 'cm1k2x3y4z5a6b7c8d9e0f1g',
  })
  @ApiResponse({
    status: 204,
    description: 'Usuário removido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    example: {
      statusCode: 404,
      message: 'Usuário não encontrado',
      error: 'Not Found',
    },
  })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
