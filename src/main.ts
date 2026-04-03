import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as YAML from 'yamljs';
import { join } from 'path';

const port = process.env.PORT ?? 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const document = YAML.load(join(process.cwd(), 'src/doc/api.yaml'));

  SwaggerModule.setup('/doc', app, document);

  await app.listen(port);

  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📘 Swagger documentation is available at http://localhost:${port}/doc`);
}

bootstrap();