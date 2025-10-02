import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserProfileController } from './user-profile.controller';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [UsersController, UserProfileController],
  providers: [UsersService, PrismaService],
  exports: [UsersService], // Exportar para usar no módulo de autenticação
})
export class UsersModule {}
