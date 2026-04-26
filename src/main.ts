import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from './logger/logger.service';
import { RequestLoggerInterceptor } from './logger/request-logger.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import * as C from './constants';
import { ValidationCustomError } from './errors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(AppLogger);
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map((err) => ({
          field: err.property,
          errors: Object.values(err.constraints),
        }));

        return new ValidationCustomError(messages);
      },
    }),
  );

  app.useGlobalInterceptors(new RequestLoggerInterceptor(logger));
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);

  const config = new DocumentBuilder()
    .setTitle('Knowledge Hub API')
    .setDescription('API documentation for Knowledge Hub')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  process.on('uncaughtException', async (err: Error) => {
    logger.fatal(
      {
        message: C.UNCAUGHT_EXCEPTION,
        error: err.message,
      },
      C.UNCAUGHT,
    );

    if (err.stack) {
      logger.fatal(err.stack, C.STACK);
    }

    await app.close();
    process.exit(1);
  });

  const shutdown = async (signal: string) => {
    logger.log(
      {
        message: `Received ${signal}, shutting down gracefully...`,
      },
      C.SHUTDOWN,
    );

    await app.close();

    logger.log(
      {
        message: C.APP_CLOSED,
      },
      C.SHUTDOWN,
    );

    process.exit(0);
  };
  process.on('SIGTERM', () => shutdown(C.SHUTDOWN));
  process.on('SIGINT', () => shutdown('SIGINT'));

  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Server is running on http://localhost:${port}`, 'Bootstrap');
  logger.log(
    `📘 Swagger documentation is available at http://localhost:${port}/doc`,
    'Bootstrap',
  );
}

bootstrap();
