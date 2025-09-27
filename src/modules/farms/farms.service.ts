import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Injectable()
export class FarmsService {
  constructor(private prisma: PrismaService) {}

  async create(createFarmDto: CreateFarmDto, ownerId: string) {
    const farm = await this.prisma.farm.create({
      data: {
        ...createFarmDto,
        ownerId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return farm;
  }

  async findAll(userId?: string, userRole?: string) {
    // Se for ADMIN, pode ver todas as fazendas
    if (userRole === 'ADMIN') {
      return this.prisma.farm.findMany({
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              alerts: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // Se for FARMER ou ANALYST, só vê suas próprias fazendas
    return this.prisma.farm.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            alerts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId?: string, userRole?: string) {
    const farm = await this.prisma.farm.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        alerts: {
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!farm) {
      throw new NotFoundException('Fazenda não encontrada');
    }

    // Verificar permissões: ADMIN pode ver tudo, outros só suas próprias fazendas
    if (userRole !== 'ADMIN' && farm.ownerId !== userId) {
      throw new ForbiddenException('Acesso negado a esta fazenda');
    }

    return farm;
  }

  async findByLocation(
    latitude: number,
    longitude: number,
    radius: number = 10,
  ) {
    // Buscar fazendas numa área aproximada (cálculo simples para MVP)
    const latRange = radius / 111; // 1 grau de latitude ≈ 111km
    const lonRange = radius / (111 * Math.cos((latitude * Math.PI) / 180));

    return this.prisma.farm.findMany({
      where: {
        latitude: {
          gte: latitude - latRange,
          lte: latitude + latRange,
        },
        longitude: {
          gte: longitude - lonRange,
          lte: longitude + lonRange,
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            alerts: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    updateFarmDto: UpdateFarmDto,
    userId?: string,
    userRole?: string,
  ) {
    const farm = await this.prisma.farm.findUnique({
      where: { id },
    });

    if (!farm) {
      throw new NotFoundException('Fazenda não encontrada');
    }

    // Verificar permissões: ADMIN pode editar tudo, outros só suas próprias fazendas
    if (userRole !== 'ADMIN' && farm.ownerId !== userId) {
      throw new ForbiddenException('Acesso negado para editar esta fazenda');
    }

    const updatedFarm = await this.prisma.farm.update({
      where: { id },
      data: updateFarmDto,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updatedFarm;
  }

  async remove(id: string, userId?: string, userRole?: string) {
    const farm = await this.prisma.farm.findUnique({
      where: { id },
    });

    if (!farm) {
      throw new NotFoundException('Fazenda não encontrada');
    }

    // Verificar permissões: ADMIN pode deletar tudo, outros só suas próprias fazendas
    if (userRole !== 'ADMIN' && farm.ownerId !== userId) {
      throw new ForbiddenException('Acesso negado para deletar esta fazenda');
    }

    await this.prisma.farm.delete({
      where: { id },
    });

    return { message: 'Fazenda removida com sucesso' };
  }

  async getStats(userId?: string, userRole?: string) {
    const whereClause = userRole === 'ADMIN' ? {} : { ownerId: userId };

    const stats = await this.prisma.farm.aggregate({
      where: whereClause,
      _count: {
        id: true,
      },
      _sum: {
        area: true,
      },
      _avg: {
        area: true,
      },
    });

    const alertsCount = await this.prisma.alert.count({
      where: {
        isActive: true,
        farm: whereClause,
      },
    });

    return {
      totalFarms: stats._count.id,
      totalArea: stats._sum.area || 0,
      averageArea: stats._avg.area || 0,
      activeAlerts: alertsCount,
    };
  }
}
