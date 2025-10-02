import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateCropTypeDto } from './dto/create-crop-type.dto';
import { UpdateCropTypeDto } from './dto/update-crop-type.dto';

@Injectable()
export class CropTypesService {
  constructor(private prisma: PrismaService) {}

  async create(createCropTypeDto: CreateCropTypeDto) {
    return this.prisma.cropType.create({
      data: createCropTypeDto,
    });
  }

  async findAll() {
    return this.prisma.cropType.findMany({
      include: {
        plantings: {
          select: {
            id: true,
            plantedAt: true,
            status: true,
            areaHa: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const cropType = await this.prisma.cropType.findUnique({
      where: { id },
      include: {
        plantings: {
          include: {
            field: {
              select: {
                id: true,
                name: true,
                areaHa: true,
              },
            },
            farm: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!cropType) {
      throw new NotFoundException('Tipo de cultura não encontrado');
    }

    return cropType;
  }

  async update(id: number, updateCropTypeDto: UpdateCropTypeDto) {
    const cropType = await this.prisma.cropType.findUnique({
      where: { id },
    });

    if (!cropType) {
      throw new NotFoundException('Tipo de cultura não encontrado');
    }

    return this.prisma.cropType.update({
      where: { id },
      data: updateCropTypeDto,
    });
  }

  async remove(id: number) {
    const cropType = await this.prisma.cropType.findUnique({
      where: { id },
    });

    if (!cropType) {
      throw new NotFoundException('Tipo de cultura não encontrado');
    }

    await this.prisma.cropType.delete({
      where: { id },
    });

    return { message: 'Tipo de cultura removido com sucesso' };
  }
}
