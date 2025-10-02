import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: createOrganizationDto,
      include: {
        _count: {
          select: {
            users: true,
            farms: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.organization.findMany({
      include: {
        _count: {
          select: {
            users: true,
            farms: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            farms: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
          take: 10, // Limite para evitar sobrecarga
        },
        farms: {
          select: {
            id: true,
            name: true,
            areaHa: true,
            centroidLat: true,
            centroidLon: true,
          },
          take: 10, // Limite para evitar sobrecarga
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }

    return organization;
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }

    return this.prisma.organization.update({
      where: { id },
      data: updateOrganizationDto,
      include: {
        _count: {
          select: {
            users: true,
            farms: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            farms: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }

    // Verificar se há usuários ou fazendas associadas
    if (organization._count.users > 0 || organization._count.farms > 0) {
      throw new ForbiddenException(
        'Não é possível deletar organização com usuários ou fazendas associadas',
      );
    }

    await this.prisma.organization.delete({
      where: { id },
    });
  }

  async getStatistics(id: number) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            farms: true,
          },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }

    // Estatísticas adicionais
    const farmStats = await this.prisma.farm.aggregate({
      where: { organizationId: id },
      _sum: {
        areaHa: true,
      },
      _avg: {
        areaHa: true,
      },
    });

    const alertCount = await this.prisma.alert.count({
      where: {
        farm: {
          organizationId: id,
        },
      },
    });

    return {
      organization: organization.name,
      totalUsers: organization._count.users,
      totalFarms: organization._count.farms,
      totalArea: farmStats._sum.areaHa || 0,
      averageArea: farmStats._avg.areaHa || 0,
      totalAlerts: alertCount,
    };
  }
}
