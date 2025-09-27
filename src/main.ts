import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('FarmNavigators API')
    .setDescription('API documentation for FarmNavigators')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentation = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });

  SwaggerModule.setup('docs', app, documentation, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(3042, '0.0.0.0', () => {
    console.log('Server is running on http://localhost:3042');
    console.log('API docs available at http://localhost:3042/docs');
  });
}

bootstrap();
