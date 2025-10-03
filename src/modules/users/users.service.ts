import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Verificar se email já existe (se fornecido)
    if (createUserDto.email) {
      const existingUserByEmail = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });
      if (existingUserByEmail) {
        throw new ConflictException('Email já está em uso');
      }
    }

    // Verificar se phone já existe (se fornecido)
    if (createUserDto.phone) {
      const existingUserByPhone = await this.prisma.user.findUnique({
        where: { phone: createUserDto.phone },
      });
      if (existingUserByPhone) {
        throw new ConflictException('Telefone já está em uso');
      }
    }

    // Hash da senha se fornecida
    const userData = { ...createUserDto };
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 12);
    }

    // Definir valores padrão
    if (!userData.language) {
      userData.language = 'pt';
    }
    if (!userData.timezone) {
      userData.timezone = 'Africa/Luanda';
    }

    const user = await this.prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        language: true,
        timezone: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        language: true,
        timezone: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        farms: {
          select: {
            id: true,
            name: true,
            areaHa: true,
            centroidLat: true,
            centroidLon: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByPhone(phone: string) {
    return this.prisma.user.findUnique({
      where: { phone },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se email já existe (se sendo alterado)
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUserByEmail = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existingUserByEmail) {
        throw new ConflictException('Email já está em uso');
      }
    }

    // Verificar se phone já existe (se sendo alterado)
    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const existingUserByPhone = await this.prisma.user.findUnique({
        where: { phone: updateUserDto.phone },
      });
      if (existingUserByPhone) {
        throw new ConflictException('Telefone já está em uso');
      }
    }

    // Se a senha foi fornecida, fazer hash
    const updateData = { ...updateUserDto };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        language: true,
        timezone: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'Usuário removido com sucesso' };
  }
}
