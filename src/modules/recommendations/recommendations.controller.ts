import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';
import { RecommendationResponseDto } from './dto/recommendation-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Recomendações')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.TECHNICIAN, Role.NGO)
  @ApiOperation({
    summary: 'Criar nova recomendação',
    description: 'Cria uma nova recomendação para uma fazenda ou campo',
  })
  @ApiResponse({
    status: 201,
    description: 'Recomendação criada com sucesso',
    type: RecommendationResponseDto,
  })
  create(@Body() createRecommendationDto: CreateRecommendationDto) {
    return this.recommendationsService.create(createRecommendationDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar recomendações',
    description: 'Retorna lista de recomendações com filtros opcionais',
  })
  @ApiQuery({
    name: 'farmId',
    required: false,
    description: 'Filtrar por ID da fazenda',
  })
  @ApiQuery({
    name: 'fieldId',
    required: false,
    description: 'Filtrar por ID do campo',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de recomendações',
    type: [RecommendationResponseDto],
  })
  findAll(
    @Query('farmId') farmId?: string,
    @Query('fieldId') fieldId?: string,
  ) {
    return this.recommendationsService.findAll(farmId, fieldId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar recomendação por ID',
    description: 'Retorna detalhes de uma recomendação específica',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da recomendação',
    type: RecommendationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Recomendação não encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.recommendationsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TECHNICIAN, Role.NGO)
  @ApiOperation({
    summary: 'Atualizar recomendação',
    description: 'Atualiza informações de uma recomendação',
  })
  @ApiResponse({
    status: 200,
    description: 'Recomendação atualizada com sucesso',
    type: RecommendationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Recomendação não encontrada',
  })
  update(
    @Param('id') id: string,
    @Body() updateRecommendationDto: UpdateRecommendationDto,
  ) {
    return this.recommendationsService.update(id, updateRecommendationDto);
  }

  @Patch(':id/action')
  @Roles(Role.FARMER, Role.ADMIN, Role.TECHNICIAN)
  @ApiOperation({
    summary: 'Marcar recomendação como executada',
    description:
      'Marca uma recomendação como tendo sido executada pelo agricultor',
  })
  @ApiResponse({
    status: 200,
    description: 'Recomendação marcada como executada',
  })
  @ApiResponse({
    status: 404,
    description: 'Recomendação não encontrada',
  })
  markAsActioned(@Param('id') id: string) {
    return this.recommendationsService.markAsActioned(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Remover recomendação',
    description: 'Remove uma recomendação do sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Recomendação removida com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Recomendação não encontrada',
  })
  remove(@Param('id') id: string) {
    return this.recommendationsService.remove(id);
  }
}
