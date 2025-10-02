import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService) {}

  async create(createRecommendationDto: CreateRecommendationDto) {
    return this.prisma.recommendation.create({
      data: createRecommendationDto,
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
    });
  }

  async findAll(farmId?: number, fieldId?: number) {
    const where: any = {};
    if (farmId) where.farmId = farmId;
    if (fieldId) where.fieldId = fieldId;

    return this.prisma.recommendation.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const recommendation = await this.prisma.recommendation.findUnique({
      where: { id },
      include: {
        field: {
          include: {
            farm: {
              select: {
                id: true,
                name: true,
                owner: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        farm: {
          select: {
            id: true,
            name: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!recommendation) {
      throw new NotFoundException('Recomendação não encontrada');
    }

    return recommendation;
  }

  async update(id: number, updateRecommendationDto: UpdateRecommendationDto) {
    const recommendation = await this.prisma.recommendation.findUnique({
      where: { id },
    });

    if (!recommendation) {
      throw new NotFoundException('Recomendação não encontrada');
    }

    return this.prisma.recommendation.update({
      where: { id },
      data: updateRecommendationDto,
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
    });
  }

  async remove(id: number) {
    const recommendation = await this.prisma.recommendation.findUnique({
      where: { id },
    });

    if (!recommendation) {
      throw new NotFoundException('Recomendação não encontrada');
    }

    await this.prisma.recommendation.delete({
      where: { id },
    });

    return { message: 'Recomendação removida com sucesso' };
  }

  async markAsActioned(id: number) {
    const recommendation = await this.prisma.recommendation.findUnique({
      where: { id },
    });

    if (!recommendation) {
      throw new NotFoundException('Recomendação não encontrada');
    }

    return this.prisma.recommendation.update({
      where: { id },
      data: { isActioned: true },
    });
  }
}
