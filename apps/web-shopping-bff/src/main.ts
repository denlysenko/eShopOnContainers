import * as dotenv from 'dotenv';

dotenv.config();

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { HttpLoggingInterceptor } from './app/interceptors/http-logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [process.env.WEB_SHOPPING_URL],
  });
  app.useGlobalInterceptors(new HttpLoggingInterceptor());

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || 'localhost';
  const identityHost = process.env.KEYKLOAK_FRONTEND_HOST || 'localhost:4000';

  const config = new DocumentBuilder()
    .setVersion('v1')
    .setTitle('eShopOnContainers - Web Shopping API Gateway')
    .setDescription('Web Shopping API Gateway')
    .addOAuth2({
      type: 'oauth2',
      flows: {
        implicit: {
          authorizationUrl: `http://${identityHost}/auth/realms/e-shop-on-containers/protocol/openid-connect/auth`,
          scopes: {
            openid: 'openid',
          },
        },
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/swagger/v1', app, document, {
    initOAuth: {
      clientId: 'api_swagger',
      additionalQueryStringParams: { nonce: '325qjlalf09230' },
    },
  });

  await app.listen(port, host, (err, address) => {
    if (err) {
      Logger.error(err);

      return;
    }

    Logger.log(`Listening at ${address}`);
  });
}

bootstrap();
