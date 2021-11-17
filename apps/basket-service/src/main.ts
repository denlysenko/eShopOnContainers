import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { exceptionFactory } from './app/exception.factory';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ exceptionFactory }));

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || 'localhost';

  const config = new DocumentBuilder()
    .setVersion('v1')
    .setTitle('eShopOnContainers - Basket API')
    .setDescription('The Basket Microservice HTTP API.')
    .addOAuth2({
      type: 'oauth2',
      flows: {
        implicit: {
          authorizationUrl:
            'http://localhost:4000/auth/realms/e-shop-on-containers/protocol/openid-connect/auth',
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
