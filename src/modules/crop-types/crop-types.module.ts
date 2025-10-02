import { Module } from '@nestjs/common';
import { CropTypesController } from './crop-types.controller';
import { CropTypesService } from './crop-types.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [CropTypesController],
  providers: [CropTypesService, PrismaService],
  exports: [CropTypesService],
})
export class CropTypesModule {}
