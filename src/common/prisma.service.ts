import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    let retries = 3;
    while (retries > 0) {
      try {
        await this.$connect();
        this.logger.log('Database connected successfully');
        break;
      } catch (error) {
        retries--;
        this.logger.warn(
          `Database connection failed. Retries left: ${retries}`,
        );
        if (retries === 0) {
          this.logger.error('Failed to connect to database after all retries');
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  }
}
