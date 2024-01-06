import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoggerModule } from 'nestjs-pino';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './common/utils';
import { UsersModule, RolesModule, AuthModule } from './modules';
import config from './common/config/configuration';
import { Address, Role, User, UserProfile } from './entities';
import { AuthGuard, RolesGuard } from './common/guards';
import { CacheMiddleware, LoggerMiddleware } from './common/middlewares';
import { RedisModule } from './infrastructure/redis/redis.module';
import { GlobalHttpExceptionFilter } from './common/filters';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          pinoHttp: {
            customProps: () => ({
              context: 'HTTP'
            }),
            transport: {
              target: 'pino-pretty',
              options: {
                singleLine: true,
                levelFirst: true,
                translateTime: true,
                colorize: config.get('APP_ENV') !== 'production'
              }
            },
            level: config.get('LOG_LEVEL') || 'info',
            useLevelLabels: true
          }
        };
      }
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validate,
      validationOptions: {
        allowUnknown: false,
        abortEarly: true
      },
      ignoreEnvVars: process.env.APP_ENV === 'staging',
      load: [config]
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // name: 'main_db',
        dialect: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        autoLoadModels: true,
        synchronize: !['staging', 'production'].includes(
          configService.get('APP_ENV')
        ),
        models: [Address, User, UserProfile, Role],
        ssl: false,
        logging: (msg) => Logger.log(msg),
        sync: {
          // force: true,
          alter: false // Set alter to false to disable automatic alterations
        }
      }),
      inject: [ConfigService]
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: Number(configService.get('JWT_EXPIRY'))
        }
      }),
      inject: [ConfigService]
    }),
    RedisModule,
    AuthModule,
    UsersModule,
    RolesModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    {
      provide: APP_FILTER,
      useClass: GlobalHttpExceptionFilter
    }
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(CacheMiddleware).forRoutes('*');
  }
}
