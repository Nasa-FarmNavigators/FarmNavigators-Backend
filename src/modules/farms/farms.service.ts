import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class FarmsService {
  constructor(private prisma: PrismaService) {}

  async create(createFarmDto: any, ownerId: number) {
    return this.prisma.farm.create({
      data: { ...createFarmDto, ownerId },
    });
  }

  async findAll() {
    return this.prisma.farm.findMany();
  }

  async findOne(id: number) {
    return this.prisma.farm.findUnique({ where: { id } });
  }

  async update(id: number, updateFarmDto: any) {
    return this.prisma.farm.update({
      where: { id },
      data: updateFarmDto,
    });
  }

  async remove(id: number) {
    return this.prisma.farm.delete({ where: { id } });
  }
}
