import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  ValidationPipe,
  VersioningType,
  Logger as NestLogger
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import express, { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import 'reflect-metadata';

const signalsNames: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGHUP'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true
    // rawBody: true,
  });

  const logger = new NestLogger('MAIN');

  signalsNames.forEach((signalName) => {
    process.on(signalName, (signal) => {
      logger.log(`Retrieved signal: ${signal}, application terminated`);
      process.exit(0);
    });
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error({ err: error });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Promise Rejection, reason: ${reason}`);
    promise.catch((err: Error) => {
      logger.error({ err });
      process.exit(1);
    });
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    // Increase the request size limit
    express.json({ limit: '5mb' })(req, res, next);
  });

  const configService = app.get(ConfigService);

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.setGlobalPrefix('/api/v1');

  app.enableVersioning({
    type: VersioningType.URI
  });

  app.enableCors({
    origin: '*',
    credentials: true
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest.JS Starter API Manager')
    .setDescription('Nest.JS Starter API Manager')
    .setVersion(process.env.npm_package_version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  if (configService.get('APP_ENV') !== 'production') {
    SwaggerModule.setup('api-docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true
      }
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: false,
      transform: true,
      stopAtFirstError: true
    })
  );

  await app.listen(configService.get('PORT'), '0.0.0.0');

  logger.log(`Application is up and running on: ${await app.getUrl()}`);
}
bootstrap();
