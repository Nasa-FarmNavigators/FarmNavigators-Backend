import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UssdController } from './ussd.controller';
import { UssdService } from './ussd.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  imports: [ConfigModule],
  controllers: [UssdController],
  providers: [UssdService, PrismaService],
  exports: [UssdService],
})
export class UssdModule {}
