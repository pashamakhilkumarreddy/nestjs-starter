import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisPrefixEnum } from 'src/common/constants';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis
  ) {}

  /**
   * Pings the Redis server to check the connection status.
   * Logs success or error messages accordingly.
   */
  async ping(): Promise<void> {
    // const redisClient = await this.redisPool.acquire();
    try {
      await this.redisClient.ping();
      this.logger.log('Redis Connection successful');
    } catch (err) {
      this.logger.error('Error acquiring Redis client:', err);
    }
    //  finally {
    //   this.redisPool.release(redisClient);
    // }
  }

  /**
   * Sets a key-value pair in Redis with a specific prefix.
   *
   * @param prefix - The prefix for the Redis key.
   * @param key - The key for the Redis entry.
   * @param value - The value to be stored in Redis.
   */
  async setValue(
    prefix: RedisPrefixEnum,
    key: string,
    value: string
  ): Promise<void> {
    const keyName = `${prefix}:${key}`;
    try {
      this.logger.log('Setting value in Redis');
      await this.redisClient.set(keyName, value);
    } catch (err) {
      this.logger.error('Error setting value in Redis:', err);
    }
  }

  /**
   * Retrieves the value associated with a key in Redis.
   *
   * @param prefix - The prefix for the Redis key.
   * @param key - The key for the Redis entry.
   *
   * @returns The value stored in Redis or null if not found.
   */
  async getValue(prefix: RedisPrefixEnum, key: string): Promise<string | null> {
    const keyName = `${prefix}:${key}`;
    try {
      const value: any = await this.redisClient.get(keyName);
      if (value) {
        this.logger.log('Value found in Redis');
        return value;
      }
      this.logger.log('Value not found in Redis');
      return null;
    } catch (err) {
      this.logger.error('Error fetching value from Redis:', err);
    }
  }

  /**
   * Deletes a key-value pair in Redis.
   *
   * @param prefix - The prefix for the Redis key.
   * @param key - The key for the Redis entry.
   */
  async deleteValue(prefix: RedisPrefixEnum, key: string): Promise<void> {
    const keyName = `${prefix}:${key}`;
    try {
      await this.redisClient.del(keyName);
    } catch (err) {
      this.logger.error('Error deleting value in Redis:', err);
    }
  }

  /**
   * Sets a key-value pair in Redis with a specific prefix and a specified expiry time.
   *
   * @param prefix - The prefix for the Redis key.
   * @param key - The key for the Redis entry.
   * @param value - The value to be stored in Redis.
   * @param expiry - The expiration time for the Redis entry (in seconds).
   */
  async setWithExpiry(
    prefix: RedisPrefixEnum,
    key: string,
    value: string,
    expiry: number
  ): Promise<void> {
    const keyName = `${prefix}:${key}`;
    try {
      await this.redisClient.set(keyName, value, 'EX', expiry);
      this.logger.log('Setting value in Redis with expiry');
    } catch (err) {
      this.logger.error('Error setting value in Redis with expiry:', err);
    }
  }

  /**
   * Handles cleanup tasks when the module is destroyed.
   * Disconnects from the Redis server to release resources.
   */
  onModuleDestroy() {
    this.logger.log('Closing Redis connections on module destroy.');
    this.redisClient.disconnect();
    // this.redisPool.drain().then(() => this.redisPool.clear());
  }
}
