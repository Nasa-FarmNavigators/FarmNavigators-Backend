import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { PrismaService } from './common/prisma.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { FarmsModule } from './modules/farms/farms.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { PythonIntegrationModule } from './modules/python-integration/python-integration.module';
import { CropTypesModule } from './modules/crop-types/crop-types.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    UsersModule,
    AuthModule,
    FarmsModule,
    OrganizationsModule,
    PythonIntegrationModule,
    CropTypesModule,
    RecommendationsModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
