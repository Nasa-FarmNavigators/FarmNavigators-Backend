import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PythonIntegrationService } from './python-integration.service';
import { PythonIntegrationController } from './python-integration.controller';
import { PrismaService } from '../../common/prisma.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  controllers: [PythonIntegrationController],
  providers: [PythonIntegrationService, PrismaService],
  exports: [PythonIntegrationService],
})
export class PythonIntegrationModule {}
