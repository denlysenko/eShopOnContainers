import * as dotenv from 'dotenv';

dotenv.config();

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { exceptionFactory } from './app/exception.factory';
import {
  CatalogDomainExceptionFilter,
  EntityNotFoundExceptionFilter,
  HttpLoggingInterceptor,
} from './app/infrastructure';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ exceptionFactory }));
  app.useGlobalFilters(
    new CatalogDomainExceptionFilter(),
    new EntityNotFoundExceptionFilter()
  );
  app.useGlobalInterceptors(new HttpLoggingInterceptor());

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || 'localhost';

  const config = new DocumentBuilder()
    .setVersion('v1')
    .setTitle('eShopOnContainers - Catalog API')
    .setDescription(
      'The Catalog Microservice HTTP API. This is a Data-Driven/CRUD microservice'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/swagger/v1', app, document);

  await app.listen(port, host, (err, address) => {
    if (err) {
      Logger.error(err);

      return;
    }

    Logger.log(`Listening at ${address}`);
  });
}

bootstrap();
