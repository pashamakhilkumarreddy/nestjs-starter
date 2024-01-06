import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from 'src/infrastructure/redis/redis.service';
import { RedisPrefixEnum } from '../constants';

@Injectable()
export class CacheMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly redisService: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const cachedData = await this.redisService.getValue(
      RedisPrefixEnum.USER,
      req.url
    );

    this.logger.log(`Checking for cached data in ${res.locals}`);
    if (cachedData) {
      // Data exists in cache
      this.logger.log('Data found in cache:', cachedData);
      // You can handle the cached data here or set it to request object for further usage
    } else {
      // Data doesn't exist in cache
      this.logger.log('Data not found in cache. Fetching from database.');
    }

    next();
  }
}
