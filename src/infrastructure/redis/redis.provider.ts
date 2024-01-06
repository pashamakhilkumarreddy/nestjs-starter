import { FactoryProvider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis, RedisOptions } from 'ioredis';

export const RedisClientFactory: FactoryProvider<Redis> = {
  provide: 'REDIS_CLIENT',
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger('RedisClientFactory');
    try {
      logger.log('Initialising Redis and cache manager!');
      const redisConfig: RedisOptions = {
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        password: configService.get('REDIS_PASSWORD'),
        enableReadyCheck: true,
        connectionName: 'nestjs-starter',
        maxRetriesPerRequest: 1,
        connectTimeout: 6000,
        sentinelMaxConnections: 9,
        keyPrefix: 'ns:'
      };

      const redisClient = new Redis(redisConfig);

      redisClient.on('error', (err: any) => {
        throw new Error(`Redis connection failed: ${err}`);
      });

      // const poolConfig: GenericPoolOptions = {
      //   max: 5,
      //   min: 2,
      //   idleTimeoutMillis: 20000,
      //   acquireTimeoutMillis: 2000,
      //   testOnBorrow: true,
      // };

      // const pool = createPool({
      //   create: async () => {
      //     const redisClient = new Redis(redisConfig);
      //     await redisClient.connect();
      //     return redisClient;
      //   },
      //   destroy: async (client: Redis) => {
      //     await client.disconnect();
      //   },
      // }, poolConfig);

      logger.log('Redis connection successful!');

      // const cacheManger = caching({
      //   store: redisStore,
      //   redisInstance: redisClient,
      //   ttl: 70,
      //   max: 90
      // });

      return redisClient;
    } catch (error: any) {
      logger.error(
        `Error initializing Redis client factory: ${error.message}`,
        error.stack
      );
      throw error;
    }
  },
  inject: [ConfigService]
};
