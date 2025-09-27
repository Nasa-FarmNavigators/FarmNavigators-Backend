import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { FarmsModule } from './modules/farms/farms.module';

@Module({
  imports: [UsersModule, AuthModule, FarmsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
