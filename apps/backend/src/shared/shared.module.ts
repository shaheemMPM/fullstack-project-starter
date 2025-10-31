import { Global, Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { RedisService } from './services/redis.service';

/**
 * Shared Module
 * Global module that provides shared services across the application
 * Controllers are intentionally not included - this is a service-only module
 */
@Global()
@Module({
	providers: [ConfigService, RedisService],
	exports: [ConfigService, RedisService],
})
export class SharedModule {}
