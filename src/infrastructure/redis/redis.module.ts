import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisClientFactory } from './redis.provider';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [RedisClientFactory, RedisService],
  exports: [RedisService]
})
export class RedisModule {}
