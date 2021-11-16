import * as dotenv from 'dotenv';

dotenv.config();

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule, eventBusConnection, queue } from './app/app.module';
import { exceptionFactory } from './app/exception.factory';
import { EntityNotFoundExceptionFilter } from './app/infrastructure';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ exceptionFactory }));

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || 'localhost';

  const config = new DocumentBuilder()
    .setVersion('v1')
    .setTitle('eShopOnContainers - Ordering API')
    .setDescription(
      'The Ordering Microservice HTTP API. This is a DDD/CQRS microservice'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/swagger/v1', app, document);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [eventBusConnection],
      queue,
      noAck: false,
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(port, host, (err, address) => {
    if (err) {
      Logger.error(err);

      return;
    }

    Logger.log(`Listening at ${address}`);
  });
}

bootstrap();
