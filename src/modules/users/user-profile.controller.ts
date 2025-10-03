import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '@prisma/client';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Buscar meu perfil',
    description: 'Retorna os dados do usuário autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário encontrado',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou ausente' })
  async getMyProfile(@Request() req): Promise<UserResponseDto> {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Atualizar meu perfil',
    description: 'Permite ao usuário atualizar seu próprio perfil',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil atualizado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido ou ausente' })
  async updateMyProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Delete('me')
  @ApiOperation({
    summary: 'Excluir minha conta',
    description: 'Permite ao usuário excluir sua própria conta',
  })
  @ApiResponse({
    status: 200,
    description: 'Conta excluída com sucesso',
    example: { message: 'Sua conta foi excluída com sucesso' },
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou ausente' })
  async deleteMyProfile(@Request() req): Promise<{ message: string }> {
    await this.usersService.remove(req.user.id);
    return { message: 'Sua conta foi excluída com sucesso' };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description:
      'Permite buscar dados básicos de outros usuários (sem informações sensíveis)',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findUser(@Param('id') id: string): Promise<UserResponseDto> {
    // Buscar usuário mas retornar apenas dados públicos
    const user = await this.usersService.findOne(id);

    // Remover informações sensíveis para usuários não-admin
    const { email, phone, ...publicData } = user;

    return {
      ...publicData,
      email: email ? email.replace(/(.{2}).*@/, '$1***@') : undefined, // Mascarar email
      phone: phone ? phone.replace(/(.{3}).*(.{3})/, '$1***$2') : undefined, // Mascarar phone
    } as UserResponseDto;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Atualizar usuário específico',
    description:
      'Permite a um usuário atualizar outro usuário (apenas para NGOs, GOVERNMENT, ADMIN com seus membros)',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async updateUser(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const currentUser = req.user;
    const targetUser = await this.usersService.findOne(id);

    // Verificar se o usuário atual tem permissão para atualizar o usuário alvo
    if (currentUser.role === Role.ADMIN) {
      // Admin pode atualizar qualquer usuário
      return this.usersService.update(id, updateUserDto);
    } else if (
      (currentUser.role === Role.NGO || currentUser.role === Role.GOVERNMENT) &&
      currentUser.organizationId &&
      targetUser.organizationId === currentUser.organizationId
    ) {
      // NGO/GOVERNMENT pode atualizar usuários da mesma organização
      return this.usersService.update(id, updateUserDto);
    } else if (currentUser.id === id) {
      // Usuário pode atualizar a si mesmo
      return this.usersService.update(id, updateUserDto);
    } else {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este usuário',
      );
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Excluir usuário específico',
    description:
      'Permite a um usuário excluir outro usuário (apenas para NGOs, GOVERNMENT, ADMIN com seus membros)',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário excluído com sucesso',
    example: { message: 'Usuário excluído com sucesso' },
  })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async deleteUser(
    @Request() req,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    const currentUser = req.user;
    const targetUser = await this.usersService.findOne(id);

    // Verificar se o usuário atual tem permissão para excluir o usuário alvo
    if (currentUser.role === Role.ADMIN) {
      // Admin pode excluir qualquer usuário
      await this.usersService.remove(id);
      return { message: 'Usuário excluído com sucesso' };
    } else if (
      (currentUser.role === Role.NGO || currentUser.role === Role.GOVERNMENT) &&
      currentUser.organizationId &&
      targetUser.organizationId === currentUser.organizationId
    ) {
      // NGO/GOVERNMENT pode excluir usuários da mesma organização
      await this.usersService.remove(id);
      return { message: 'Usuário excluído com sucesso' };
    } else if (currentUser.id === id) {
      // Usuário pode excluir a si mesmo
      await this.usersService.remove(id);
      return { message: 'Sua conta foi excluída com sucesso' };
    } else {
      throw new ForbiddenException(
        'Você não tem permissão para excluir este usuário',
      );
    }
  }
}
