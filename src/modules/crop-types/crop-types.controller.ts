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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CropTypesService } from './crop-types.service';
import { CreateCropTypeDto } from './dto/create-crop-type.dto';
import { UpdateCropTypeDto } from './dto/update-crop-type.dto';
import { CropTypeResponseDto } from './dto/crop-type-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Tipos de Cultura')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('crop-types')
export class CropTypesController {
  constructor(private readonly cropTypesService: CropTypesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TECHNICIAN)
  @ApiOperation({
    summary: 'Criar novo tipo de cultura',
    description: 'Cria um novo tipo de cultura no sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Tipo de cultura criado com sucesso',
    type: CropTypeResponseDto,
  })
  create(@Body() createCropTypeDto: CreateCropTypeDto) {
    return this.cropTypesService.create(createCropTypeDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar tipos de cultura',
    description: 'Retorna lista de todos os tipos de cultura',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de cultura',
    type: [CropTypeResponseDto],
  })
  findAll() {
    return this.cropTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar tipo de cultura por ID',
    description: 'Retorna detalhes de um tipo de cultura específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do tipo de cultura',
    type: CropTypeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de cultura não encontrado',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cropTypesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TECHNICIAN)
  @ApiOperation({
    summary: 'Atualizar tipo de cultura',
    description: 'Atualiza informações de um tipo de cultura',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de cultura atualizado com sucesso',
    type: CropTypeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de cultura não encontrado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCropTypeDto: UpdateCropTypeDto,
  ) {
    return this.cropTypesService.update(id, updateCropTypeDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Remover tipo de cultura',
    description: 'Remove um tipo de cultura do sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de cultura removido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de cultura não encontrado',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cropTypesService.remove(id);
  }
}
