import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from './logger/logger.service';
import { RequestLoggerInterceptor } from './logger/request-logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const logger = new AppLogger();
  app.useLogger(logger);
  app.useGlobalInterceptors(new RequestLoggerInterceptor(logger));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);
  const config = new DocumentBuilder()
    .setTitle('Knowledge Hub API')
    .setDescription('API documentation for Knowledge Hub')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Server is running on http://localhost:${port}`, 'Bootstrap');
  logger.log(
    `📘 Swagger documentation is available at http://localhost:${port}/doc`,
    'Bootstrap',
  );
}

bootstrap();
